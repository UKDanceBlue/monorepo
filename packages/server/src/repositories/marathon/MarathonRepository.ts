import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

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
type UniqueMarathonParam = { id: number } | { uuid: string } | { year: string };

@Service()
export class MarathonRepository {
  constructor(private prisma: PrismaClient) {}

  findMarathonByUnique(param: UniqueMarathonParam) {
    return this.prisma.marathon.findUnique({ where: param });
  }

  findCurrentMarathon() {
    return this.prisma.marathon.findFirst({
      orderBy: { year: "desc" },
      where: { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
    });
  }

  findNextMarathon() {
    return this.prisma.marathon.findFirst({
      orderBy: { year: "asc" },
      where: { endDate: { gte: new Date() } },
    });
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

  async getMarathonHours(param: UniqueMarathonParam) {
    const rows = await this.prisma.marathon.findUnique({
      where: param,
      include: { hours: true },
    });
    return rows?.hours ?? [];
  }

  createMarathon({
    year,
    startDate,
    endDate,
  }: {
    year: string;
    startDate: string;
    endDate: string;
  }) {
    return this.prisma.marathon.create({
      data: {
        year,
        startDate,
        endDate,
      },
    });
  }

  updateMarathon(
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
  ) {
    try {
      return this.prisma.marathon.update({
        where: param,
        data: {
          year,
          startDate,
          endDate,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  deleteMarathon(param: UniqueMarathonParam) {
    try {
      return this.prisma.marathon.delete({ where: param });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }
}
