import { Container } from "@freshgum/typedi";
import type { PrismaClient } from "@prisma/client";
import type {
  Args,
  Operation,
  Result as PrismaResult,
} from "@prisma/client/runtime/library";
import type * as runtime from "@prisma/client/runtime/library";
import { asyncResultAll } from "@ukdanceblue/common";
import {
  InvariantError,
  NotFoundError,
  UnknownError,
} from "@ukdanceblue/common/error";
import { AsyncResult, type Option } from "ts-results-es";
import { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import { isPromise } from "util/types";

import { toPrismaError } from "#error/prisma.js";
import type { PrismaService } from "#lib/prisma.js";
import {
  type FieldLookup,
  type FindManyParams,
  parseFindManyParams as parseFindManyParamsFunc,
} from "#lib/queryFromArgs.js";

import {
  type AsyncRepositoryResult,
  handleRepositoryError,
  type RepositoryError,
  type RepositoryResult,
  type SimpleUniqueParam,
} from "./shared.js";

type Transaction = Omit<PrismaClient, runtime.ITXClientDenyList>;

export interface WithTxParam {
  tx?: Transaction;
}

export interface WithByParam<UniqueParam> {
  by: UniqueParam;
}

export interface FindOneParams<UniqueParam>
  extends WithByParam<UniqueParam>,
    WithTxParam {}
export interface FindAndCountParams<Field extends string>
  extends FindManyParams<Field>,
    WithTxParam {}
export type FindAllParams = WithTxParam;
export interface CreateParams<Init extends object> extends WithTxParam {
  init: Init;
}
export interface UpdateParams<UniqueParam, Init extends object>
  extends WithByParam<UniqueParam>,
    WithTxParam {
  init: Init;
}
export interface DeleteParams<UniqueParam>
  extends WithByParam<UniqueParam>,
    WithTxParam {}
export interface CreateMultipleParams<Init extends object> extends WithTxParam {
  data: {
    init: Init;
  }[];
}
export interface DeleteMultipleParams<UniqueParam> extends WithTxParam {
  data: {
    by: UniqueParam;
  }[];
}

// We do this no-op with pick to prevent typescript from resolving the type
// This means that autocomplete will give use FindOneResult<T> instead of { id: string; uuid: string; ... }
type AliasedPrismaResult<T, A, F extends Operation> = Pick<
  NonNullable<Awaited<PrismaResult<T, A, F>>>,
  keyof NonNullable<Awaited<PrismaResult<T, A, F>>>
>;
export type FindOneResult<T, A> = Option<
  AliasedPrismaResult<T, A, "findUnique">
>;
export interface FindAndCountResult<T, A> {
  total: number;
  selectedRows: PrismaResult<T, A, "findMany">;
}
export type FindAllResult<T, A> = AliasedPrismaResult<T, A, "findMany">;
export type CreateResult<T, A> = AliasedPrismaResult<T, A, "create">;
export type UpdateResult<T, A> = AliasedPrismaResult<T, A, "update">;
export type DeleteResult<T, A> = AliasedPrismaResult<T, A, "delete">;
export type CreateMultipleResult<T, A> = AliasedPrismaResult<
  T,
  A,
  "createManyAndReturn"
>;
export type DeleteMultipleResult<T, A> = AliasedPrismaResult<
  T,
  A,
  "deleteMany"
>;

interface BaseRepository<
  T,
  UniqueParam,
  Field extends string,
  Include extends Args<T, "findUnique">["include"],
> {
  uniqueToWhere(by: UniqueParam): Args<T, "findUnique">["where"];
  findOne?(params: FindOneParams<UniqueParam>): AsyncRepositoryResult<
    FindOneResult<
      T,
      {
        include: Include;
      }
    >
  >;

  findAndCount?(
    params: FindAndCountParams<Field>
  ): AsyncRepositoryResult<FindAndCountResult<T, { include: Include }>>;

  findAll?(
    params: FindAllParams
  ): AsyncRepositoryResult<FindAllResult<T, { include: Include }>>;

  create?(
    params: CreateParams<object>
  ): AsyncRepositoryResult<CreateResult<T, { include: Include }>>;

  update?(
    params: UpdateParams<UniqueParam, object>
  ): AsyncRepositoryResult<UpdateResult<T, { include: Include }>>;

  delete?(
    params: DeleteParams<UniqueParam>
  ): AsyncRepositoryResult<DeleteResult<T, { include: Include }>>;

  createMultiple?(
    params: CreateMultipleParams<object>
  ): AsyncRepositoryResult<CreateMultipleResult<T, { include: Include }>>;

  deleteMultiple?(
    params: DeleteMultipleParams<UniqueParam>
  ): AsyncRepositoryResult<DeleteMultipleResult<T, { include: Include }>>;
}

export function buildDefaultRepository<
  T,
  UniqueParam,
  Field extends string,
  Include extends Args<T, "findUnique">["include"] = Record<string, never>,
>(
  tableName: Capitalize<Exclude<keyof PrismaClient, `$${string}` | symbol>>,
  fieldLookup: FieldLookup<T, Field>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
  interface DefaultRepository
    extends BaseRepository<T, UniqueParam, Field, Include> {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
  abstract class DefaultRepository
    implements BaseRepository<T, UniqueParam, Field, Include>
  {
    public static readonly fields: Field[] = Object.keys(
      fieldLookup
    ) as Field[];

    constructor(protected readonly prisma: PrismaService) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      Container.setValue(`${tableName}Repository` as string, this);
    }

    protected static simpleUniqueToWhere(
      by: SimpleUniqueParam
    ): { id: number } | { uuid: string } {
      if ("id" in by) {
        return { id: by.id };
      } else if ("uuid" in by) {
        return { uuid: by.uuid };
      }
      by satisfies never;
      throw new Error("Invalid SimpleUniqueParam");
    }

    protected handleQueryError<D>(
      promise: Promise<D>
    ): AsyncRepositoryResult<D> {
      return this.promiseToAsyncResult(promise);
    }

    protected handleTransactionError<D>(
      callback: (
        tx: Transaction
      ) => AsyncRepositoryResult<D> | Promise<RepositoryResult<D>>,
      tx?: Transaction
    ): AsyncRepositoryResult<D> {
      if (tx) {
        const cb = callback(tx);
        return isPromise(cb) ? new AsyncResult(cb) : cb;
      }

      return new AsyncResult(
        (async (): Promise<Result<D, RepositoryError>> => {
          let result: Result<D, RepositoryError> = Err(
            new InvariantError("Transaction not completed")
          );
          await this.prisma.$transaction(async (tx) => {
            try {
              const cb = callback(tx);
              result = await (isPromise(cb) ? cb : cb.promise);
              if (result.isErr()) {
                throw result.error;
              }
            } catch (error) {
              result = handleRepositoryError(error);
              throw result.error;
            }
          });
          return result;
        })()
      );
    }

    protected batchMapTransaction<V, R>(
      data: V[],
      callback: (tx: Transaction, value: V) => AsyncRepositoryResult<R>,
      tx?: Transaction,
      batchSize = 25
    ): AsyncRepositoryResult<R[]> {
      return this.handleTransactionError(async (tx) => {
        const segmented: V[][] = [];
        for (let i = 0; i < data.length; i++) {
          if (i % batchSize === 0) {
            segmented.push([]);
          }
          segmented[segmented.length - 1]!.push(data[i]!);
        }
        const okResults: R[] = [];
        for (const batch of segmented) {
          const results = batch.map((value) => callback(tx, value));
          // eslint-disable-next-line no-await-in-loop
          const combined = await asyncResultAll(...results).promise;
          if (combined.isErr()) {
            return combined;
          }
          okResults.push(...combined.value);
        }
        return Ok(okResults);
      }, tx);
    }

    protected promiseToAsyncResult<T>(
      promise: Promise<T>
    ): AsyncRepositoryResult<T> {
      return new AsyncResult<T, RepositoryError>(
        promise.then(
          (v) => Ok(v),
          (error) =>
            Err(toPrismaError(error).unwrapOr(new UnknownError("Unknown")))
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

    protected mapToNotFound<T>(
      val: Option<T>,
      ...params: ConstructorParameters<typeof NotFoundError>
    ): Result<T, NotFoundError> {
      return NotFoundError.fromOption(
        val,
        params[0] ?? "field",
        params[1] ?? `${tableName}Repository`
      );
    }

    protected parseFindManyParams(
      param: FindManyParams<(typeof DefaultRepository.fields)[number]>,
      additionalWhere: Args<T, "findMany">["where"][] = []
    ) {
      return parseFindManyParamsFunc(param, fieldLookup, additionalWhere);
    }

    public abstract uniqueToWhere(
      by: UniqueParam
    ): Args<T, "findUnique">["where"];
  }

  return DefaultRepository;
}
