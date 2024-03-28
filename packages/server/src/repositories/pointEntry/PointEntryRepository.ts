import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import {
  buildPointEntryOrder,
  buildPointEntryWhere,
} from "./pointEntryRepositoryUtils.js";

const pointEntryBooleanKeys = [] as const;
type PointEntryBooleanKey = (typeof pointEntryBooleanKeys)[number];

const pointEntryDateKeys = ["createdAt", "updatedAt"] as const;
type PointEntryDateKey = (typeof pointEntryDateKeys)[number];

const pointEntryIsNullKeys = [] as const;
type PointEntryIsNullKey = (typeof pointEntryIsNullKeys)[number];

const pointEntryNumericKeys = [] as const;
type PointEntryNumericKey = (typeof pointEntryNumericKeys)[number];

const pointEntryOneOfKeys = [] as const;
type PointEntryOneOfKey = (typeof pointEntryOneOfKeys)[number];

const pointEntryStringKeys = [] as const;
type PointEntryStringKey = (typeof pointEntryStringKeys)[number];

export type PointEntryFilters = FilterItems<
  PointEntryBooleanKey,
  PointEntryDateKey,
  PointEntryIsNullKey,
  PointEntryNumericKey,
  PointEntryOneOfKey,
  PointEntryStringKey
>;

type UniquePointEntryParam = { id: number } | { uuid: string };

@Service()
export class PointEntryRepository {
  constructor(private prisma: PrismaClient) {}

  findPointEntryByUnique(param: UniquePointEntryParam) {
    return this.prisma.pointEntry.findUnique({ where: param });
  }

  listPointEntries({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly PointEntryFilters[] | undefined | null;
    order?: readonly [key: string, sort: SortDirection][] | undefined | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildPointEntryWhere(filters);
    const orderBy = buildPointEntryOrder(order);

    return this.prisma.pointEntry.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countPointEntries({
    filters,
  }: {
    filters?: readonly PointEntryFilters[] | undefined | null;
  }) {
    const where = buildPointEntryWhere(filters);

    return this.prisma.pointEntry.count({
      where,
    });
  }

  getPointEntryPersonFrom(param: { id: number } | { uuid: string }) {
    return this.prisma.pointEntry.findUnique({ where: param }).person();
  }

  getPointEntryOpportunity(param: { id: number } | { uuid: string }) {
    return this.prisma.pointEntry
      .findUnique({ where: param })
      .pointOpportunity();
  }

  getPointEntryTeam(param: { id: number } | { uuid: string }) {
    return this.prisma.pointEntry.findUnique({ where: param }).team();
  }

  createPointEntry({
    points,
    comment,
    personParam,
    opportunityParam,
    teamParam,
  }: {
    points: number;
    comment?: string | undefined | null;
    personParam?: { id: number } | { uuid: string } | undefined | null;
    opportunityParam?: { id: number } | { uuid: string } | undefined | null;
    teamParam: { id: number } | { uuid: string };
  }) {
    return this.prisma.pointEntry.create({
      data: {
        points,
        comment,
        person: personParam != null ? { connect: personParam } : undefined,
        pointOpportunity:
          opportunityParam != null ? { connect: opportunityParam } : undefined,
        team: { connect: teamParam },
      },
    });
  }

  updatePointEntry(
    param: UniquePointEntryParam,
    {
      points,
      comment,
      personParam,
      opportunityParam,
      teamParam,
    }: {
      points?: number | undefined;
      comment?: string | undefined | null;
      personParam?: { id: number } | { uuid: string } | undefined | null;
      opportunityParam?: { id: number } | { uuid: string } | undefined | null;
      teamParam?: { id: number } | { uuid: string } | undefined;
    }
  ) {
    try {
      return this.prisma.pointEntry.update({
        where: param,
        data: {
          points,
          comment,
          person:
            personParam === null
              ? { disconnect: true }
              : personParam === undefined
              ? undefined
              : { connect: personParam },
          pointOpportunity:
            opportunityParam === null
              ? { disconnect: true }
              : opportunityParam === undefined
              ? undefined
              : { connect: opportunityParam },
          team: teamParam === undefined ? undefined : { connect: teamParam },
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

  deletePointEntry(param: UniquePointEntryParam) {
    try {
      return this.prisma.pointEntry.delete({ where: param });
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
