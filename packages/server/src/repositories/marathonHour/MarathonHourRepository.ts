import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";

type MarathonHourUniqueParam = SimpleUniqueParam;

import type {
  FieldsOfListQueryArgs,
  ListMarathonHoursArgs,
} from "@ukdanceblue/common";

import { prismaToken } from "#lib/typediTokens.js";
import { buildDefaultRepository } from "#repositories/Default.js";
import type { SimpleUniqueParam } from "#repositories/shared.js";

@Service([prismaToken])
export class MarathonHourRepository extends buildDefaultRepository<
  PrismaClient["marathonHour"],
  SimpleUniqueParam,
  FieldsOfListQueryArgs<ListMarathonHoursArgs>
>("MarathonHour", {}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(by: SimpleUniqueParam) {
    return MarathonHourRepository.simpleUniqueToWhere(by);
  }

  findMarathonHourByUnique(param: MarathonHourUniqueParam) {
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

  async getMaps(param: MarathonHourUniqueParam) {
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
    marathon: MarathonHourUniqueParam;
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
    param: MarathonHourUniqueParam,
    {
      title,
      details,
      marathon,
      shownStartingAt,
      durationInfo,
    }: {
      title?: string | undefined;
      details?: string | undefined | null;
      marathon?: MarathonHourUniqueParam | undefined;
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

  deleteMarathonHour(param: MarathonHourUniqueParam) {
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

  addMap(
    param: MarathonHourUniqueParam,
    image: { id: number } | { uuid: string }
  ) {
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

  removeMap(
    param: MarathonHourUniqueParam,
    image: { id: number } | { uuid: string }
  ) {
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
