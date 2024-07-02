import { Marathon, MarathonHour, Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Err, Ok, Result } from "ts-results-es";
import { Service } from "typedi";

import { NotFoundError } from "../../lib/error/direct.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { handleRepositoryError, type RepositoryError } from "../shared.js";

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

@Service()
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

  async findCurrentMarathon(): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.findFirst({
        orderBy: { year: "asc" },
        where: { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
      });
      if (!marathon) {
        return Err(new NotFoundError({ what: "Marathon" }));
      }
      return Ok(marathon);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findActiveMarathon(): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.findFirst({
        orderBy: { year: "asc" },
      });
      if (!marathon) {
        return Err(new NotFoundError({ what: "Marathon" }));
      }
      return Ok(marathon);
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
    startDate: string;
    endDate: string;
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
      startDate?: string;
      endDate?: string;
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
