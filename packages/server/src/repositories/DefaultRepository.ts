import type { BasicError } from "@ukdanceblue/common/error";
import {
  InvariantError,
  NotFoundError,
  toBasicError,
} from "@ukdanceblue/common/error";
import type { eq, InferInsertModel, InferSelectModel, SQL } from "drizzle-orm";
import {
  DrizzleError,
  type Table,
  TransactionRollbackError,
} from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { QueryResult } from "pg";
import type { AsyncResult } from "ts-results-es";
import { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import { db } from "#db";
import { ParsedDrizzleError } from "#error/drizzle.js";
import {
  type FindManyParams,
  parseFindManyParams,
} from "#lib/queryFromArgs.js";

import type { RepositoryError } from "./shared.js";

export function buildDefaultRepository<
  T extends Table,
  UniqueParam,
  Field extends string,
>(
  table: T,
  fieldLookup: Record<Field, SQL.Aliased | AnyPgColumn>,
  _dummyUniqueParam: UniqueParam
) {
  abstract class DefaultRepository {
    protected async handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound?: false
    ): Promise<Result<D, ParsedDrizzleError | BasicError>>;
    protected async handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound: ConstructorParameters<typeof NotFoundError>[0]
    ): Promise<
      Result<NonNullable<D>, ParsedDrizzleError | BasicError | NotFoundError>
    >;
    protected async handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound:
        | false
        | ConstructorParameters<typeof NotFoundError>[0] = false
    ): Promise<Result<D, ParsedDrizzleError | BasicError | NotFoundError>> {
      try {
        return handleNotFound
          ? await this.mapToNotFound(Ok(await promise), handleNotFound)
          : Ok(await promise);
      } catch (error) {
        return error instanceof DrizzleError
          ? Err(new ParsedDrizzleError(error))
          : Err(toBasicError(error));
      }
    }

    protected async handleTransactionError<D>(
      callback: Parameters<typeof db.transaction<Result<D, RepositoryError>>>[0]
    ): Promise<Result<D, RepositoryError>> {
      let result: Result<D, RepositoryError> = Err(
        new InvariantError("Transaction not completed")
      );
      await db.transaction(async (tx) => {
        try {
          result = await callback(tx);
          if (result.isErr()) {
            tx.rollback();
          }
        } catch (error) {
          result =
            error instanceof DrizzleError
              ? Err(new ParsedDrizzleError(error))
              : Err(toBasicError(error));
          if (!(error instanceof TransactionRollbackError)) {
            tx.rollback();
          } else {
            throw error;
          }
        }
      });
      return result;
    }

    protected async mapToNotFound<T, E>(
      val:
        | Result<T | null | undefined, E>
        | Promise<Result<T | null | undefined, E>>
        | AsyncResult<T | null | undefined, E>,
      params: ConstructorParameters<typeof NotFoundError>[0]
    ): Promise<Result<T, E | NotFoundError>> {
      if (val instanceof Promise) {
        val = await val;
      }
      return (Result.isResult(val) ? val.toAsyncResult() : val).andThen((v) =>
        v
          ? Ok(v)
          : Err(
              new NotFoundError({
                what: "field",
                where: `${table._.name}Repository`,
                ...params,
              })
            )
      ).promise;
    }

    protected parseFindManyParams(param: FindManyParams<Field>) {
      return parseFindManyParams(param, fieldLookup);
    }

    public abstract uniqueToWhere(by: UniqueParam): ReturnType<typeof eq>;

    public abstract findOne(
      by: UniqueParam,
      ...args: unknown[]
    ): Promise<Result<InferSelectModel<T>, RepositoryError>>;

    public abstract findAndCount(
      param: FindManyParams<string>,
      ...args: unknown[]
    ): Promise<
      Result<
        { total: number; selectedRows: InferSelectModel<T>[] },
        RepositoryError
      >
    >;

    public async findAll(): Promise<
      Result<InferSelectModel<T>[], RepositoryError>
    > {
      return this.handleQueryError(db.select().from(table));
    }

    public async create(
      data: InferInsertModel<T>,
      ..._args: unknown[]
    ): Promise<
      Result<
        InferSelectModel<T> extends undefined
          ? QueryResult<never>
          : InferSelectModel<T>[],
        RepositoryError
      >
    > {
      return this.handleQueryError(db.insert(table).values(data).returning());
    }

    public abstract update(
      by: UniqueParam,
      data: InferInsertModel<T> & InferSelectModel<T>,
      ...args: unknown[]
    ): Promise<Result<InferSelectModel<T>, RepositoryError>>;

    public abstract delete(
      by: UniqueParam,
      ...args: unknown[]
    ): Promise<Result<InferSelectModel<T>, RepositoryError>>;
  }

  return DefaultRepository;
}
