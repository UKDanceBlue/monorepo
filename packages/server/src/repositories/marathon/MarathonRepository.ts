import { Service } from "@freshgum/typedi";
import { optionOf } from "@ukdanceblue/common/error";
import { and, desc, eq, gte, InferSelectModel, lte } from "drizzle-orm";
import { Ok, Option, Result } from "ts-results-es";

import { db } from "#db";
import { sqlCurrentTimestamp } from "#lib/sqlValues.js";
import { prismaToken } from "#lib/typediTokens.js";
import { buildDefaultRepository } from "#repositories/DefaultRepository.js";
import {
  handleRepositoryError,
  type RepositoryError,
} from "#repositories/shared.js";
import { marathon, marathonHour } from "#schema/tables/marathon.sql.js";

export type UniqueMarathonParam =
  | { id: number }
  | { uuid: string }
  | { year: string };

@Service([prismaToken])
export class MarathonRepository extends buildDefaultRepository(
  marathon,
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

  /**
   * Find the current marathon, if one exists
   *
   * A marathon is considered current if the current date is between the start and end dates
   */
  async findCurrentMarathon(): Promise<
    Result<Option<InferSelectModel<typeof marathon>>, RepositoryError>
  > {
    try {
      const row = await db.query.marathon.findFirst({
        orderBy: desc(marathon.year),
        where: and(
          lte(marathon.startDate, sqlCurrentTimestamp),
          gte(marathon.endDate, sqlCurrentTimestamp)
        ),
      });
      return Ok(optionOf(row));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  /**
   * Find the active marathon, if one exists
   *
   * A marathon is considered active if it is the most recent marathon by marathon year
   */
  async findActiveMarathon(): Promise<
    Result<Option<InferSelectModel<typeof marathon>>, RepositoryError>
  > {
    try {
      const row = await db.query.marathon.findFirst({
        orderBy: desc(marathon.year),
      });
      return Ok(optionOf(row));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getMarathonHours(
    param: UniqueMarathonParam
  ): Promise<Result<InferSelectModel<typeof marathonHour>[], RepositoryError>> {
    try {
      const rows = await db.query.marathon.findFirst({
        where: this.uniqueToWhere(param),
        with: { marathonHours: true },
      });
      return Ok(rows?.marathonHours ?? []);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }
}
