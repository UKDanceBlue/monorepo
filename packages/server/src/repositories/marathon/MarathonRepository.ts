import { Service } from "@freshgum/typedi";
import { withActiveSpan } from "@sentry/node";
import { optionOf } from "@ukdanceblue/common/error";
import { and, desc, eq, gte, InferSelectModel, lte } from "drizzle-orm";
import type { DateTime } from "luxon";
import { AsyncResult, Ok, Option, Result } from "ts-results-es";

import type { FindManyParams } from "#lib/queryFromArgs.js";
import { sqlCurrentTimestamp } from "#lib/sqlValues.js";
import { drizzleToken } from "#lib/typediTokens.js";
import {
  buildDefaultRepository,
  type Transaction,
} from "#repositories/DefaultRepository.js";
import {
  handleRepositoryError,
  type RepositoryError,
} from "#repositories/shared.js";
import { marathon, marathonHour } from "#schema/tables/marathon.sql.js";
import { membership, person } from "#schema/tables/person.sql.js";
import { committee, team } from "#schema/tables/team.sql.js";

import { MarathonModel } from "./MarathonModel.js";

export type UniqueMarathonParam =
  | { id: number }
  | { uuid: string }
  | { year: string };

@Service([drizzleToken])
export class MarathonRepository extends buildDefaultRepository(
  marathon,
  MarathonModel,
  {
    id: marathon.id,
    uuid: marathon.uuid,
    year: marathon.year,
    startDate: marathon.startDate,
    endDate: marathon.endDate,
    createdAt: marathon.createdAt,
    updatedAt: marathon.updatedAt,
  },
  {} as UniqueMarathonParam
) {
  public uniqueToWhere(by: UniqueMarathonParam) {
    if ("id" in by) {
      return eq(marathon.id, by.id);
    } else if ("uuid" in by) {
      return eq(marathon.uuid, by.uuid);
    } else {
      return eq(marathon.year, by.year);
    }
  }

  findOne({
    by,
    tx,
  }: {
    by: UniqueMarathonParam;
    tx?: Transaction;
  }): AsyncResult<MarathonModel, RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db).query.marathon.findFirst({
        where: this.uniqueToWhere(by),
      }),
      {
        what: "Marathon",
        where: "MarathonRepository.findOne",
      }
    ).map((row) => new MarathonModel(row));
  }

  findAll({
    tx,
  }: {
    tx?: Transaction;
  }): AsyncResult<MarathonModel[], RepositoryError> {
    return this.handleQueryError((tx ?? this.db).query.marathon.findMany(), {
      what: "Marathon",
      where: "MarathonRepository.findAll",
    }).map((rows) => rows.map((row) => new MarathonModel(row)));
  }

  findAndCount({
    param,
    tx,
  }: {
    param: FindManyParams<(typeof MarathonRepository.fields)[number]>;
    tx?: Transaction;
  }): AsyncResult<
    { total: number; selectedRows: MarathonModel[] },
    RepositoryError
  > {
    return this.parseFindManyParams(param)
      .toAsyncResult()
      .andThen((param) => {
        let query = (tx ?? this.db).select().from(marathon).$dynamic();
        const countQuery = (tx ?? this.db).$count(marathon, param.where);
        if (param.where) {
          query = query.where(param.where);
        }
        if (param.orderBy) {
          query = query.orderBy(...param.orderBy);
        }
        if (param.limit) {
          query = query.limit(param.limit);
        }
        if (param.offset) {
          query = query.offset(param.offset);
        }
        return new AsyncResult(
          Promise.all([
            this.handleQueryError(query).promise,
            this.handleQueryError(countQuery).promise,
          ]).then(([rows, total]) => Result.all([rows, total]))
        );
      })
      .map(([selectedRows, total]) => ({
        total,
        selectedRows: selectedRows.map((row) => new MarathonModel(row)),
      }));
  }

  create({
    init,
    tx,
  }: {
    init: {
      year: string;
      startDate?: DateTime<true> | null | undefined;
      endDate?: DateTime<true> | null | undefined;
    };
    tx?: Transaction;
  }): AsyncResult<MarathonModel, RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db)
        .insert(marathon)
        .values(init)
        .returning()
        .then((rows) => rows[0]),
      {
        what: "Marathon",
        where: "MarathonRepository.create",
      }
    ).map((row) => new MarathonModel(row));
  }

  update({
    by,
    init,
    tx,
  }: {
    by: UniqueMarathonParam;
    init: Partial<{
      year: string;
      startDate: DateTime<true> | null;
      endDate: DateTime<true> | null;
    }>;
    tx?: Transaction;
  }): AsyncResult<MarathonModel, RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db)
        .update(marathon)
        .set(init)
        .where(this.uniqueToWhere(by))
        .returning()
        .then((rows) => rows[0]),
      {
        what: "Marathon",
        where: "MarathonRepository.update",
      }
    ).map((row) => new MarathonModel(row));
  }

  delete({
    by,
    tx,
  }: {
    by: UniqueMarathonParam;
    tx?: Transaction;
  }): AsyncResult<MarathonModel, RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db)
        .delete(marathon)
        .where(this.uniqueToWhere(by))
        .returning()
        .then((rows) => rows[0]),
      {
        what: "Marathon",
        where: "MarathonRepository.delete",
      }
    ).map((row) => new MarathonModel(row));
  }

  /**
   * Find the current marathon, if one exists
   *
   * A marathon is considered current if the current date is between the start and end dates
   */
  findCurrentMarathon(): AsyncResult<MarathonModel, RepositoryError> {
    return this.handleQueryError(
      this.db.query.marathon.findFirst({
        orderBy: desc(marathon.year),
        where: and(
          lte(marathon.startDate, sqlCurrentTimestamp),
          gte(marathon.endDate, sqlCurrentTimestamp)
        ),
      }),
      {
        what: "Marathon",
        where: "MarathonRepository.findCurrentMarathon",
      }
    ).map((row) => new MarathonModel(row));
  }

  /**
   * Find the active marathon, if one exists
   *
   * A marathon is considered active if it is the most recent marathon by marathon year
   */
  findActiveMarathon(): AsyncResult<MarathonModel, RepositoryError> {
    return this.handleQueryError(
      this.db.query.marathon.findFirst({
        orderBy: desc(marathon.year),
      }),
      {
        what: "Marathon",
        where: "MarathonRepository.findActiveMarathon",
      }
    ).map((row) => new MarathonModel(row));
  }

  getMarathonHours(
    param: UniqueMarathonParam
  ): AsyncResult<InferSelectModel<typeof marathonHour>[], RepositoryError> {
    return this.handleQueryError(
      this.db.query.marathon.findFirst({
        where: this.uniqueToWhere(param),
        with: { marathonHours: true },
      }),
      {
        what: "MarathonHour",
        where: "MarathonRepository.getMarathonHours",
      }
    ).map((row) => row.marathonHours);
  }
}
