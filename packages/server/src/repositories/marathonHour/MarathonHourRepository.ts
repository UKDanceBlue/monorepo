import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";

const marathonHourBooleanKeys = [] as const;
type MarathonHourBooleanKey = (typeof marathonHourBooleanKeys)[number];

const marathonHourDateKeys = [
  "shownStartingAt",
  "createdAt",
  "updatedAt",
] as const;
type MarathonHourDateKey = (typeof marathonHourDateKeys)[number];

const marathonHourIsNullKeys = [] as const;
type MarathonHourIsNullKey = (typeof marathonHourIsNullKeys)[number];

const marathonHourNumericKeys = [] as const;
type MarathonHourNumericKey = (typeof marathonHourNumericKeys)[number];

const marathonHourOneOfKeys = ["marathonYear"] as const;
type MarathonHourOneOfKey = (typeof marathonHourOneOfKeys)[number];

const marathonHourStringKeys = ["title", "details", "durationInfo"] as const;
type MarathonHourStringKey = (typeof marathonHourStringKeys)[number];

export type MarathonHourOrderKeys =
  | "title"
  | "details"
  | "durationInfo"
  | "marathonYear"
  | "shownStartingAt"
  | "createdAt"
  | "updatedAt";

export type MarathonHourFilters = FilterItems<
  MarathonHourBooleanKey,
  MarathonHourDateKey,
  MarathonHourIsNullKey,
  MarathonHourNumericKey,
  MarathonHourOneOfKey,
  MarathonHourStringKey
>;

type UniqueParam = { id: number } | { uuid: string };

import { prismaToken } from "#lib/typediTokens.js";

@Service([prismaToken])
export class MarathonHourRepository {
  constructor(private prisma: PrismaClient) {}

  findMarathonHourByUnique(param: UniqueParam) {
    return this.prisma.marathonHour.findUnique({ where: param });
  }

  findCurrentMarathonHour() {
    return this.prisma.marathonHour.findFirst({
      where: {
        shownStartingAt: { lte: new Date() },
        marathon: { endDate: { gte: new Date() } },
      },
      orderBy: { shownStartingAt: "desc" },
    });
  }

  listMarathonHours({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly MarathonHourFilters[] | undefined | null;
    order?:
      | readonly [key: MarathonHourOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildMarathonHourWhere(filters);
    const orderBy = buildMarathonHourOrder(order);

    return this.prisma.marathonHour.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countMarathonHours({
    filters,
  }: {
    filters?: readonly MarathonHourFilters[] | undefined | null;
  }) {
    const where = buildMarathonHourWhere(filters);

    return this.prisma.marathonHour.count({ where });
  }

  async getMaps(param: UniqueParam) {
    const rows = await this.prisma.marathonHour.findUnique({
      where: param,
      include: {
        maps: { orderBy: { imageId: "asc" }, include: { image: true } },
      },
    });
    return rows?.maps.map((map) => map.image);
  }

  createMarathonHour({
    title,
    details,
    marathon,
    shownStartingAt,
    durationInfo,
  }: {
    title: string;
    details?: string | undefined | null;
    marathon: UniqueParam;
    shownStartingAt: Date;
    durationInfo: string;
  }) {
    return this.prisma.marathonHour.create({
      data: {
        title,
        details,
        marathon: { connect: marathon },
        shownStartingAt,
        durationInfo,
      },
    });
  }

  updateMarathonHour(
    param: UniqueParam,
    {
      title,
      details,
      marathon,
      shownStartingAt,
      durationInfo,
    }: {
      title?: string | undefined;
      details?: string | undefined | null;
      marathon?: UniqueParam | undefined;
      shownStartingAt?: Date | undefined;
      durationInfo?: string | undefined;
    }
  ) {
    try {
      return this.prisma.marathonHour.update({
        where: param,
        data: {
          title,
          details,
          marathon: marathon ? { connect: marathon } : undefined,
          shownStartingAt,
          durationInfo,
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

  deleteMarathonHour(param: UniqueParam) {
    try {
      return this.prisma.marathonHour.delete({ where: param });
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

  addMap(param: UniqueParam, image: { id: number } | { uuid: string }) {
    try {
      return this.prisma.marathonHour.update({
        where: param,
        data: {
          maps: {
            connect: image,
          },
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

  removeMap(param: UniqueParam, image: { id: number } | { uuid: string }) {
    try {
      return this.prisma.marathonHour.update({
        where: param,
        data: {
          maps: {
            disconnect: image,
          },
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
}
