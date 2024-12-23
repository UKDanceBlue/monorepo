import type { BasicError } from "@ukdanceblue/common/error";
import {
  ActionDeniedError,
  InvariantError,
  NotFoundError,
  toBasicError,
} from "@ukdanceblue/common/error";
import type { eq, InferInsertModel, InferSelectModel, SQL } from "drizzle-orm";
import {
  DrizzleError,
  or,
  type Table,
  TransactionRollbackError,
} from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { AnyPgColumn, PgTransaction } from "drizzle-orm/pg-core";
import type { QueryResult } from "pg";
import { AsyncResult } from "ts-results-es";
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
  type TableValue =
    InferSelectModel<T> extends undefined
      ? QueryResult<never>
      : InferSelectModel<T>[];
  type Transaction = PgTransaction<
    NodePgQueryResultHKT,
    (typeof db)["_"]["fullSchema"],
    NonNullable<(typeof db)["_"]["schema"]>
  >;

  abstract class DefaultRepository {
    protected handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound?: false
    ): AsyncResult<D, ParsedDrizzleError | BasicError>;
    protected handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound: ConstructorParameters<typeof NotFoundError>[0]
    ): AsyncResult<
      NonNullable<D>,
      ParsedDrizzleError | BasicError | NotFoundError
    >;
    protected handleQueryError<D>(
      promise: Promise<D>,
      handleNotFound:
        | false
        | ConstructorParameters<typeof NotFoundError>[0] = false
    ): AsyncResult<D, ParsedDrizzleError | BasicError | NotFoundError> {
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

    protected promiseToAsyncResult<T>(
      promise: Promise<T>
    ): AsyncResult<T, ParsedDrizzleError | BasicError> {
      return new AsyncResult<T, ParsedDrizzleError | BasicError>(
        promise.then(
          (v) => Ok(v),
          (error) =>
            error instanceof DrizzleError
              ? Err(new ParsedDrizzleError(error))
              : Err(toBasicError(error))
        )
      );
    }

    protected resultToAsyncResult<T, E>(
      val: Result<T, E> | Promise<Result<T, E>> | AsyncResult<T, E>
    ): AsyncResult<T, E> {
      if (val instanceof Promise) {
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
                where: `${table._.name}Repository`,
                sensitive: false,
                ...params,
              })
            )
      );
    }

    protected parseFindManyParams(param: FindManyParams<Field>) {
      return parseFindManyParams(param, fieldLookup);
    }

    public abstract uniqueToWhere(by: UniqueParam): ReturnType<typeof eq>;

    public findOne({
      by,
      tx,
    }: {
      by: UniqueParam;
      tx?: Transaction;
    }): AsyncResult<InferSelectModel<T>, RepositoryError> {
      return this.handleQueryError(
        (tx ?? db).select().from(table).where(this.uniqueToWhere(by)),
        { where: `${table._.name}Repository.findOne` }
      ).andThen((rows) => {
        if (rows.length === 1) {
          return Ok(rows[0]!);
        } else {
          return Err(
            new NotFoundError({
              what: "field",
              where: `${table._.name}Repository.findOne`,
            })
          );
        }
      });
    }

    public findAndCount({
      param,
      tx,
    }: {
      param: FindManyParams<Field>;
      tx?: Transaction;
    }): AsyncResult<
      { total: number; selectedRows: InferSelectModel<T>[] },
      RepositoryError
    > {
      const parsed = this.parseFindManyParams(param);
      if (parsed.isErr()) {
        return parsed.toAsyncResult();
      }
      const { limit, offset, order, where } = parsed.value;
      let query = (tx ?? db).select().from(table).$dynamic();
      if (where) {
        query = query.where(where);
      }
      if (order) {
        query = query.orderBy(...order);
      }
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.offset(offset);
      }
      const rows = this.handleQueryError(query, {
        where: `${table._.name}Repository.findAndCount`,
      });
      const count = this.handleQueryError((tx ?? db).$count(table, where), {
        where: `${table._.name}Repository.findAndCount`,
      });
      return rows.andThen((selectedRows) =>
        count.andThen((total) => Ok({ total, selectedRows }))
      );
    }

    public findAll({
      tx,
    }: {
      tx?: Transaction;
    }): AsyncResult<InferSelectModel<T>[], RepositoryError> {
      return this.handleQueryError((tx ?? db).select().from(table));
    }

    public create({
      init,
      tx,
    }: {
      init: InferInsertModel<T>;
      tx?: Transaction;
    }): AsyncResult<TableValue, RepositoryError> {
      return this.handleQueryError(
        (tx ?? db)
          .insert(table)
          .values(init)
          .returning()
          .then((row) => row[0] as TableValue)
      );
    }

    public update({
      by,
      init,
      tx,
    }: {
      by: UniqueParam;
      init: InferInsertModel<T> & InferSelectModel<T>;
      tx?: Transaction;
    }): AsyncResult<TableValue, RepositoryError> {
      return this.handleQueryError(
        (tx ?? db)
          .update(table)
          .set(init)
          .where(this.uniqueToWhere(by))
          .returning(),
        { where: `${table._.name}Repository.update` }
      );
    }

    public delete({
      by,
      tx,
    }: {
      by: UniqueParam;
      tx?: Transaction;
    }): AsyncResult<TableValue, RepositoryError> {
      return this.handleQueryError(
        (tx ?? db).delete(table).where(this.uniqueToWhere(by)).returning(),
        { where: `${table._.name}Repository.delete` }
      );
    }

    public createMultiple({
      data,
      tx,
    }: {
      data: {
        init: InferInsertModel<T>;
      }[];
      tx?: Transaction;
    }) {
      return this.handleQueryError(
        (tx ?? db)
          .insert(table)
          .values(data.map(({ init }) => init))
          .returning()
      );
    }

    public updateMultiple({
      data,
      tx,
    }: {
      data: {
        by: UniqueParam;
        init: InferInsertModel<T> & InferSelectModel<T>;
      }[];
      tx?: Transaction;
    }) {
      const func = (tx: Transaction) => {
        return new AsyncResult(
          Promise.all(
            data.map(({ by, init }) => this.update({ by, init, tx }).promise)
          ).then((val) => Result.all(val))
        );
      };

      return tx
        ? func(tx)
        : this.handleTransactionError((tx) => func(tx).promise);
    }

    public deleteMultiple({
      data,
      tx,
    }: {
      data: {
        by: UniqueParam;
      }[];
      tx?: Transaction;
    }): AsyncResult<TableValue, RepositoryError> {
      if (data.length === 0) {
        return Err(
          new ActionDeniedError("Must pass at least one filter to delete")
        ).toAsyncResult();
      }
      return this.handleQueryError(
        (tx ?? db)
          .delete(table)
          .where(or(...data.map(({ by }) => this.uniqueToWhere(by))))
          .returning()
      );
    }
  }

  return DefaultRepository;
}
