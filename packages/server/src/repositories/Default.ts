import { Container } from "@freshgum/typedi";
import type { PrismaClient } from "@prisma/client";
import type {
  Args,
  Result as PrismaResult,
} from "@prisma/client/runtime/library";
import type * as runtime from "@prisma/client/runtime/library";
import type { BasicError } from "@ukdanceblue/common/error";
import { InvariantError, NotFoundError } from "@ukdanceblue/common/error";
import { AsyncResult } from "ts-results-es";
import { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import { isPromise } from "util/types";

import { PostgresError } from "#error/postgres.js";
import {
  type FindManyParams,
  type GetWhereFn,
  parseFindManyParams as parseFindManyParamsFunc,
} from "#lib/queryFromArgs.js";

import { handleRepositoryError, type RepositoryError } from "./shared.js";

type Transaction = Omit<PrismaClient, runtime.ITXClientDenyList>;

interface BaseRepository<T, UniqueParam, Field extends string> {
  uniqueToWhere(by: UniqueParam): Args<T, "findUnique">["where"];

  findOne?({
    by,
    tx,
  }: {
    by: UniqueParam;
    tx?: Transaction;
  }): AsyncResult<
    PrismaResult<T, Args<T, "findUnique">, "findUnique">,
    RepositoryError
  >;

  findAndCount?({
    param,
    tx,
  }: {
    param: FindManyParams<Field>;
    tx?: Transaction;
  }): AsyncResult<
    {
      total: number;
      selectedRows: PrismaResult<T, Args<T, "findMany">, "findMany">[];
    },
    RepositoryError
  >;

  findAll?({
    tx,
  }: {
    tx?: Transaction;
  }): AsyncResult<
    PrismaResult<T, Args<T, "findMany">, "findMany">[],
    RepositoryError
  >;

  create?({
    init,
    tx,
  }: {
    init: Args<T, "create">["data"];
    tx?: Transaction;
  }): AsyncResult<
    PrismaResult<T, Args<T, "create">, "create">,
    RepositoryError
  >;

  update?({
    by,
    init,
    tx,
  }: {
    by: UniqueParam;
    init: Args<T, "update">["data"];
    tx?: Transaction;
  }): AsyncResult<
    PrismaResult<T, Args<T, "update">, "update">,
    RepositoryError
  >;

  delete?({
    by,
    tx,
  }: {
    by: UniqueParam;
    tx?: Transaction;
  }): AsyncResult<
    PrismaResult<T, Args<T, "delete">, "delete">,
    RepositoryError
  >;

  createMultiple?({
    data,
    tx,
  }: {
    data: {
      init: Args<T, "createMany">["data"];
    }[];
    tx?: Transaction;
  }): AsyncResult<
    PrismaResult<T, Args<T, "createMany">, "createMany">[],
    RepositoryError
  >;

  deleteMultiple?({
    data,
    tx,
  }: {
    data: {
      by: UniqueParam;
    }[];
    tx?: Transaction;
  }): AsyncResult<
    PrismaResult<T, Args<T, "deleteMany">, "deleteMany">[],
    RepositoryError
  >;
}

export function buildDefaultRepository<T, UniqueParam, Field extends string>(
  tableName: string,
  fieldLookup: Record<Field, GetWhereFn<T>>
) {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
  interface DefaultRepository extends BaseRepository<T, UniqueParam, Field> {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
  abstract class DefaultRepository {
    public static readonly fields: Field[] = Object.keys(
      fieldLookup
    ) as Field[];

    constructor(protected readonly prisma: PrismaClient) {
      Container.setValue(`${tableName}Repository`, this);
    }

    protected handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound?: false
    ): AsyncResult<D, PostgresError | BasicError>;
    protected handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound: ConstructorParameters<typeof NotFoundError>[0]
    ): AsyncResult<NonNullable<D>, PostgresError | BasicError | NotFoundError>;
    protected handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound:
        | false
        | ConstructorParameters<typeof NotFoundError>[0] = false
    ): AsyncResult<D, PostgresError | BasicError | NotFoundError> {
      return handleNotFound
        ? this.mapToNotFound(this.promiseToAsyncResult(promise), handleNotFound)
        : this.promiseToAsyncResult(promise);
    }

    protected async handleTransactionError<D>(
      callback: (tx: Transaction) => Promise<Result<D, RepositoryError>>
    ): Promise<Result<D, RepositoryError>> {
      let result: Result<D, RepositoryError> = Err(
        new InvariantError("Transaction not completed")
      );
      await this.prisma.$transaction(async (tx) => {
        try {
          result = await callback(tx);
          if (result.isErr()) {
            throw new Error("Rollback");
          }
        } catch (error) {
          result = handleRepositoryError(error);
          throw error;
        }
      });
      return result;
    }

    protected promiseToAsyncResult<T>(
      promise: Promise<T>
    ): AsyncResult<T, PostgresError | BasicError> {
      return new AsyncResult<T, PostgresError | BasicError>(
        promise.then(
          (v) => Ok(v),
          (error) => Err(PostgresError.fromUnknown(error))
        )
      );
    }

    protected resultToAsyncResult<T, E>(
      val: Result<T, E> | Promise<Result<T, E>> | AsyncResult<T, E>
    ): AsyncResult<T, E> {
      if (isPromise(val)) {
        val = new AsyncResult(val);
      }
      if (Result.isResult(val)) {
        val = val.toAsyncResult();
      }
      return val;
    }

    protected mapToNotFound<T, E>(
      val:
        | Result<T | null | undefined, E>
        | Promise<Result<T | null | undefined, E>>
        | AsyncResult<T | null | undefined, E>,
      params: ConstructorParameters<typeof NotFoundError>[0]
    ): AsyncResult<T, E | NotFoundError> {
      return this.resultToAsyncResult(val).andThen((v) =>
        v
          ? Ok(v)
          : Err(
              new NotFoundError({
                what: "field",
                where: `${tableName}Repository`,
                sensitive: false,
                ...params,
              })
            )
      );
    }

    protected parseFindManyParams(
      param: FindManyParams<(typeof DefaultRepository.fields)[number]>
    ) {
      return parseFindManyParamsFunc(param, fieldLookup);
    }

    public abstract uniqueToWhere(
      by: UniqueParam
    ): Args<T, "findUnique">["where"];
  }

  return DefaultRepository;
}
