import { Service } from "@freshgum/typedi";
import { Marathon, MarathonHour, Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { NotFoundError, optionOf } from "@ukdanceblue/common/error";
import { Err, Ok, Option, Result } from "ts-results-es";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import {
  handleRepositoryError,
  type RepositoryError,
} from "#repositories/shared.js";

import {
  buildMarathonOrder,
  buildMarathonWhere,
} from "./marathonRepositoryUtils.js";

const marathonBooleanKeys = [] as const;
type MarathonBooleanKey = (typeof marathonBooleanKeys)[number];

const marathonDateKeys = [
  "startDate",
  "endDate",
  "createdAt",
  "updatedAt",
] as const;
type MarathonDateKey = (typeof marathonDateKeys)[number];

const marathonIsNullKeys = [] as const;
type MarathonIsNullKey = (typeof marathonIsNullKeys)[number];

const marathonNumericKeys = [] as const;
type MarathonNumericKey = (typeof marathonNumericKeys)[number];

const marathonOneOfKeys = ["year"] as const;
type MarathonOneOfKey = (typeof marathonOneOfKeys)[number];

const marathonStringKeys = [] as const;
type MarathonStringKey = (typeof marathonStringKeys)[number];

export type MarathonOrderKeys =
  | "year"
  | "startDate"
  | "endDate"
  | "createdAt"
  | "updatedAt";

export type MarathonFilters = FilterItems<
  MarathonBooleanKey,
  MarathonDateKey,
  MarathonIsNullKey,
  MarathonNumericKey,
  MarathonOneOfKey,
  MarathonStringKey
>;

// type UniqueParam = { id: number } | { uuid: string };
export type UniqueMarathonParam =
  | { id: number }
  | { uuid: string }
  | { year: string };

import { prismaToken } from "#prisma";

@Service([prismaToken])
export class MarathonRepository {
  constructor(private prisma: PrismaClient) {}

  async findMarathonByUnique(
    param: UniqueMarathonParam
  ): Promise<Result<Marathon, RepositoryError>> {
    try {
      const row = await this.prisma.marathon.findUnique({ where: param });
      if (!row) {
        return Err(new NotFoundError({ what: "Marathon" }));
      }
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  /**
   * Find the current marathon, if one exists
   *
   * A marathon is considered current if the current date is between the start and end dates
   */
  async findCurrentMarathon(): Promise<
    Result<Option<Marathon>, RepositoryError>
  > {
    try {
      const marathon = await this.prisma.marathon.findFirst({
        orderBy: { year: "desc" },
        where: { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
      });
      return Ok(optionOf(marathon));
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
    Result<Option<Marathon>, RepositoryError>
  > {
    try {
      const marathon = await this.prisma.marathon.findFirst({
        orderBy: { year: "desc" },
      });
      return Ok(optionOf(marathon));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  listMarathons({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly MarathonFilters[] | undefined | null;
    order?:
      | readonly [key: MarathonOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildMarathonWhere(filters);
    const orderBy = buildMarathonOrder(order);

    return this.prisma.marathon.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countMarathons({
    filters,
  }: {
    filters?: readonly MarathonFilters[] | undefined | null;
  }) {
    const where = buildMarathonWhere(filters);

    return this.prisma.marathon.count({ where });
  }

  async getMarathonHours(
    param: UniqueMarathonParam
  ): Promise<Result<MarathonHour[], RepositoryError>> {
    try {
      const rows = await this.prisma.marathon.findUnique({
        where: param,
        include: { hours: true },
      });
      return Ok(rows?.hours ?? []);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async createMarathon({
    year,
    startDate,
    endDate,
  }: {
    year: string;
    startDate?: string | undefined | null;
    endDate?: string | undefined | null;
  }): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.create({
        data: {
          year,
          startDate,
          endDate,
        },
      });
      return Ok(marathon);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async updateMarathon(
    param: UniqueMarathonParam,
    {
      year,
      startDate,
      endDate,
    }: {
      year?: string;
      startDate?: string | undefined | null;
      endDate?: string | undefined | null;
    }
  ): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.update({
        where: param,
        data: {
          year,
          startDate,
          endDate,
        },
      });
      return Ok(marathon);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError({ what: "Marathon" }));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async deleteMarathon(
    param: UniqueMarathonParam
  ): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.delete({ where: param });
      return Ok(marathon);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError({ what: "Marathon" }));
      } else {
        return handleRepositoryError(error);
      }
    }
  }
}
