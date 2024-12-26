import { Container } from "@freshgum/typedi";
import type { GlobalId, Resource } from "@ukdanceblue/common";
import type { BasicError } from "@ukdanceblue/common/error";
import { InvariantError, NotFoundError } from "@ukdanceblue/common/error";
import type { eq, SQL, View } from "drizzle-orm";
import { is } from "drizzle-orm";
import { Table, TransactionRollbackError } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTable, PgView } from "drizzle-orm/pg-core";
import {
  type AnyPgColumn,
  getTableConfig,
  getViewConfig,
  type PgTransaction,
} from "drizzle-orm/pg-core";
import { AsyncResult } from "ts-results-es";
import { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import { isPromise } from "util/types";

import type { Drizzle } from "#db";
import { PostgresError } from "#error/postgres.js";
import {
  type FindManyParams,
  parseFindManyParams as parseFindManyParamsFunc,
} from "#lib/queryFromArgs.js";

import type { RepositoryError } from "./shared.js";

export type Transaction = PgTransaction<
  NodePgQueryResultHKT,
  Drizzle["_"]["fullSchema"],
  NonNullable<Drizzle["_"]["schema"]>
>;

export abstract class DatabaseModel<
  T extends PgTable | PgView,
  R extends Resource,
> {
  constructor(public readonly row: T["$inferSelect"]) {}

  public abstract toResource(): R;
}

export function mapToResource<T extends PgTable | PgView, R extends Resource>(
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  this: void,
  model: DatabaseModel<T, R>
): R {
  return model.toResource();
}

export function mapToResources<T extends PgTable | PgView, R extends Resource>(
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  this: void,
  models: DatabaseModel<T, R>[]
): R[] {
  return models.map((model) => model.toResource());
}

type InsertType<T extends Table | View> = T extends Table
  ? Omit<T["$inferInsert"], "id" | "uuid" | "createdAt" | "updatedAt">
  : never;
type UpdateType<T extends Table | View> = T extends Table
  ? Partial<Omit<T["$inferSelect"], "id" | "uuid" | "createdAt" | "updatedAt">>
  : never;

export function buildDefaultDatabaseModel<
  T extends PgTable | PgView,
  R extends typeof Resource & {
    init: (...args: InitParams) => InstanceType<R>;
  },
  InitParams extends never[],
>(table: T, ResourceCls: R) {
  type SelectType = T["$inferSelect"];
  const tableName = getTableOrViewName(table);

  abstract class DefaultDatabaseModel extends DatabaseModel<
    T,
    InstanceType<R>
  > {
    protected repository = Container.get<
      BaseRepository<T & Table, DefaultDatabaseModel, { uuid: string }, never>
    >(`${tableName}Repository`);

    public static fromResource(
      this: {
        fromRow: (
          row: SelectType,
          ...args: []
        ) => DatabaseModel<T, InstanceType<R>>;
        repository: BaseRepository<
          T & Table,
          DefaultDatabaseModel,
          { uuid: string },
          never
        >;
      },
      resource: R & { id: GlobalId },
      ..._args: unknown[]
    ): AsyncResult<DatabaseModel<T, InstanceType<R>>, RepositoryError> {
      if (!this.repository.findOne) {
        return Err(
          new InvariantError("Repository does not have a findOne method")
        ).toAsyncResult();
      }
      return this.repository.findOne({ by: { uuid: resource.id.id } });
    }

    protected abstract rowToInitParams(
      row: SelectType
    ): Parameters<(typeof ResourceCls)["init"]>;

    public toResource(): InstanceType<R> {
      return ResourceCls.init(...this.rowToInitParams(this.row));
    }
  }

  return DefaultDatabaseModel;
}

interface BaseRepository<
  T extends PgTable | PgView,
  Model extends DatabaseModel<T, Resource>,
  UniqueParam,
  Field extends string,
> {
  uniqueToWhere(by: UniqueParam): ReturnType<typeof eq>;

  findOne?({
    by,
    tx,
  }: {
    by: UniqueParam;
    tx?: Transaction;
  }): AsyncResult<Model, RepositoryError>;

  findAndCount?({
    param,
    tx,
  }: {
    param: FindManyParams<Field>;
    tx?: Transaction;
  }): AsyncResult<{ total: number; selectedRows: Model[] }, RepositoryError>;

  findAll?({ tx }: { tx?: Transaction }): AsyncResult<Model[], RepositoryError>;

  create?({
    init,
    tx,
  }: {
    init: InsertType<T>;
    tx?: Transaction;
  }): AsyncResult<Model, RepositoryError>;

  update?({
    by,
    init,
    tx,
  }: {
    by: UniqueParam;
    init: UpdateType<T>;
    tx?: Transaction;
  }): AsyncResult<Model, RepositoryError>;

  delete?({
    by,
    tx,
  }: {
    by: UniqueParam;
    tx?: Transaction;
  }): AsyncResult<Model, RepositoryError>;

  createMultiple?({
    data,
    tx,
  }: {
    data: {
      init: InsertType<T>;
    }[];
    tx?: Transaction;
  }): AsyncResult<Model[], RepositoryError>;

  updateMultiple?({
    data,
    tx,
  }: {
    data: {
      by: UniqueParam;
      init: UpdateType<T>;
    }[];
    tx?: Transaction;
  }): AsyncResult<Model[], RepositoryError>;

  deleteMultiple?({
    data,
    tx,
  }: {
    data: {
      by: UniqueParam;
    }[];
    tx?: Transaction;
  }): AsyncResult<Model[], RepositoryError>;
}

export function buildDefaultRepository<
  T extends PgTable | PgView,
  Model extends DatabaseModel<T, Resource>,
  UniqueParam,
  Field extends string,
>(
  table: T,
  _ModelCls: new (row: T["$inferSelect"]) => Model,
  fieldLookup: Record<Field, SQL.Aliased | AnyPgColumn>,
  _dummyUniqueParam: UniqueParam
) {
  const tableName = getTableOrViewName(table);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unsafe-declaration-merging
  interface DefaultRepository
    extends BaseRepository<T, Model, UniqueParam, Field> {}
  // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
  abstract class DefaultRepository {
    public static readonly fields: Field[] = Object.keys(
      fieldLookup
    ) as Field[];

    constructor(protected readonly db: Drizzle) {
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
      await this.db.transaction(async (tx) => {
        try {
          result = await callback(tx);
          if (result.isErr()) {
            tx.rollback();
          }
        } catch (error) {
          result = Err(PostgresError.fromUnknown(error));
          if (!is(error, TransactionRollbackError)) {
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

    public abstract uniqueToWhere(by: UniqueParam): ReturnType<typeof eq>;
  }

  return DefaultRepository;
}

function getTableOrViewName(table: PgTable | PgView) {
  return is(table, Table)
    ? getTableConfig(table).name
    : getViewConfig(table).name;
}
