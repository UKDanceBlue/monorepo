import { InvariantError, toBasicError } from "@ukdanceblue/common/error";
import {
  type ColumnsSelection,
  DrizzleError,
  type QueryPromise,
  type Table,
  TransactionRollbackError,
} from "drizzle-orm";
import type {
  CreatePgSelectFromBuilderMode,
  PgSelectBase,
  SelectedFields,
} from "drizzle-orm/pg-core";
import type {
  GetSelectTableName,
  GetSelectTableSelection,
  JoinNullability,
} from "drizzle-orm/query-builders/select.types";
import type { AsyncResult, Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import { db } from "#db";
import { ParsedDrizzleError } from "#error/drizzle.js";

import type { RepositoryError } from "./shared.js";

export function buildDefaultRepository<T extends Table>(table: T) {
  return class DefaultRepository {
    protected async handleQueryError<D>(
      promise: QueryPromise<D>
    ): Promise<Result<D, RepositoryError>> {
      try {
        return Ok(await promise.execute());
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

    protected getDefaultSelect<
      TSelection extends SelectedFields,
      TNullabilityMap extends Record<string, JoinNullability>,
    >(
      selection: TSelection | undefined
    ): PgSelectBase<T["_"]["name"], TSelection, "partial" | "single"> {
      const base = selection
        ? db.select(selection).from(table)
        : db.select().from(table);
      return base;
    }
    protected get defaultSelect() {
      return this.getDefaultSelect(undefined);
    }

    public findOne(where: (typeof this)["defaultSelect"]["where"]) {
      return this.handleQueryErrors(this.defaultSelect.where(where).limit(1));
    }
  };
}
