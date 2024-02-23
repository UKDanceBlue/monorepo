
import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildPointOpportunityOrder, buildPointOpportunityWhere } from "./pointOpportunityRepositoryUtils.js";

const pointOpportunityBooleanKeys = [] as const;
type PointOpportunityBooleanKey = (typeof pointOpportunityBooleanKeys)[number];

const pointOpportunityDateKeys = ["createdAt", "updatedAt"] as const;
type PointOpportunityDateKey = (typeof pointOpportunityDateKeys)[number];

const pointOpportunityIsNullKeys = [] as const;
type PointOpportunityIsNullKey = (typeof pointOpportunityIsNullKeys)[number];

const pointOpportunityNumericKeys = [] as const;
type PointOpportunityNumericKey = (typeof pointOpportunityNumericKeys)[number];

const pointOpportunityOneOfKeys = [] as const;
type PointOpportunityOneOfKey = (typeof pointOpportunityOneOfKeys)[number];

const pointOpportunityStringKeys = [] as const;
type PointOpportunityStringKey = (typeof pointOpportunityStringKeys)[number];

export type PointOpportunityFilters = FilterItems<
  PointOpportunityBooleanKey,
  PointOpportunityDateKey,
  PointOpportunityIsNullKey,
  PointOpportunityNumericKey,
  PointOpportunityOneOfKey,
  PointOpportunityStringKey
>;

type UniquePointOpportunityParam = { id: number } | { uuid: string };

@Service()
export class PointOpportunityRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}

    findPointOpportunityByUnique(param: UniquePointOpportunityParam) {
      return this.prisma.pointOpportunity.findUnique({where: param});
    }

    listPointOpportunity({
      filters,
      order,
      skip,
      take,
    }: {
      filters?: readonly PointOpportunityFilters[] | undefined | null;
      order?: readonly [key: string, sort: SortDirection][] | undefined | null;
      skip?: number | undefined | null;
      take?: number | undefined | null;
    }) {
      const where = buildPointOpportunityWhere(filters);
      const orderBy = buildPointOpportunityOrder(order);

      return this.prisma.pointOpportunity.findMany({
        where,
        orderBy,
        skip: skip ?? undefined,
        take: take ?? undefined,
      });
    }

    countPointOpportunity({
      filters,
    }: {
      filters?: readonly PointOpportunityFilters[] | undefined | null;
    }) {
      const where = buildPointOpportunityWhere(filters);

      return this.prisma.pointOpportunity.count({
        where,
      });
    }

    createPointOpportunity(data: Prisma.PointOpportunityCreateInput) {
      return this.prisma.pointOpportunity.create({ data });
    }

    updatePointOpportunity(param: UniquePointOpportunityParam, data: Prisma.PointOpportunityUpdateInput) {
      try {
        return this.prisma.pointOpportunity.update({ where: param, data });
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

    deletePointOpportunity(param: UniquePointOpportunityParam) {
      try {
        return this.prisma.pointOpportunity.delete({ where: param });
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