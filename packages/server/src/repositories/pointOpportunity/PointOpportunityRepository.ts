import { Service } from "@freshgum/typedi";
import type { SortDirection } from "@ukdanceblue/common";

const pointOpportunityBooleanKeys = [] as const;
type PointOpportunityBooleanKey = (typeof pointOpportunityBooleanKeys)[number];

const pointOpportunityDateKeys = [
  "opportunityDate",
  "createdAt",
  "updatedAt",
] as const;
type PointOpportunityDateKey = (typeof pointOpportunityDateKeys)[number];

const pointOpportunityIsNullKeys = [] as const;
type PointOpportunityIsNullKey = (typeof pointOpportunityIsNullKeys)[number];

const pointOpportunityNumericKeys = [] as const;
type PointOpportunityNumericKey = (typeof pointOpportunityNumericKeys)[number];

const pointOpportunityOneOfKeys = ["type", "marathonUuid"] as const;
type PointOpportunityOneOfKey = (typeof pointOpportunityOneOfKeys)[number];

const pointOpportunityStringKeys = ["name"] as const;
type PointOpportunityStringKey = (typeof pointOpportunityStringKeys)[number];

export type PointOpportunityOrderKeys =
  | "name"
  | "opportunityDate"
  | "type"
  | "marathonUuid"
  | "createdAt"
  | "updatedAt";

export type PointOpportunityFilters = FilterItems<
  PointOpportunityBooleanKey,
  PointOpportunityDateKey,
  PointOpportunityIsNullKey,
  PointOpportunityNumericKey,
  PointOpportunityOneOfKey,
  PointOpportunityStringKey
>;

type UniquePointOpportunityParam = { id: number } | { uuid: string };

import { drizzleToken } from "#lib/typediTokens.js";
import { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import { SimpleUniqueParam } from "#repositories/shared.js";

@Service([drizzleToken])
export class PointOpportunityRepository {
  constructor(protected readonly db: Drizzle) {}

  findPointOpportunityByUnique(param: UniquePointOpportunityParam) {
    return this.prisma.pointOpportunity.findUnique({ where: param });
  }

  listPointOpportunities({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly PointOpportunityFilters[] | undefined | null;
    order?:
      | readonly [key: PointOpportunityOrderKeys, sort: SortDirection][]
      | undefined
      | null;
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

  countPointOpportunities({
    filters,
  }: {
    filters?: readonly PointOpportunityFilters[] | undefined | null;
  }) {
    const where = buildPointOpportunityWhere(filters);

    return this.prisma.pointOpportunity.count({
      where,
    });
  }

  getEventForPointOpportunity(param: UniquePointOpportunityParam) {
    return this.prisma.pointOpportunity
      .findUnique({
        where: param,
      })
      .event();
  }

  createPointOpportunity({
    name,
    type,
    eventParam,
    opportunityDate,
    marathon,
  }: {
    name: string;
    type: PointOpportunityType;
    eventParam?: SimpleUniqueParam | undefined | null;
    opportunityDate?: Date | undefined | null;
    marathon: UniqueMarathonParam;
  }) {
    return this.prisma.pointOpportunity.create({
      data: {
        name,
        type,
        event: eventParam
          ? {
              connect: eventParam,
            }
          : undefined,
        opportunityDate,
        marathon: {
          connect: marathon,
        },
      },
    });
  }

  updatePointOpportunity(
    param: UniquePointOpportunityParam,
    {
      name,
      type,
      eventParam,
      opportunityDate,
    }: {
      name?: string | undefined;
      type?: PointOpportunityType | undefined;
      eventParam?: { id: number } | { uuid: string } | undefined | null;
      opportunityDate?: Date | undefined | null;
    }
  ) {
    try {
      return this.prisma.pointOpportunity.update({
        where: param,
        data: {
          name,
          type,
          event: eventParam
            ? {
                connect: eventParam,
              }
            : undefined,
          opportunityDate,
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
