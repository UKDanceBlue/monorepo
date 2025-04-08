import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type {
  FieldsOfListQueryArgs,
  ListMarathonHoursArgs,
} from "@ukdanceblue/common";
import { Ok } from "ts-results-es";

import { PrismaService } from "#lib/prisma.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";
import type {
  AsyncRepositoryResult,
  SimpleUniqueParam,
} from "#repositories/shared.js";

type MarathonHourUniqueParam = SimpleUniqueParam;

@Service([PrismaService])
export class MarathonHourRepository extends buildDefaultRepository<
  PrismaClient["marathonHour"],
  MarathonHourUniqueParam,
  FieldsOfListQueryArgs<ListMarathonHoursArgs>
>("MarathonHour", {
  title: {
    getWhere: (title) => Ok({ title }),
    getOrderBy: (title) => Ok({ title }),
    searchable: true,
  },
  details: {
    getWhere: (details) => Ok({ details }),
    getOrderBy: (details) => Ok({ details }),
    searchable: true,
  },
  marathonYear: {
    getWhere: (marathonYear) => Ok({ marathon: { year: marathonYear } }),
    getOrderBy: (marathonYear) => Ok({ marathon: { year: marathonYear } }),
  },
  durationInfo: {
    getWhere: (durationInfo) => Ok({ durationInfo }),
    getOrderBy: (durationInfo) => Ok({ durationInfo }),
  },
  shownStartingAt: {
    getWhere: (shownStartingAt) => Ok({ shownStartingAt }),
    getOrderBy: (shownStartingAt) => Ok({ shownStartingAt }),
  },
  createdAt: {
    getWhere: (createdAt) => Ok({ createdAt }),
    getOrderBy: (createdAt) => Ok({ createdAt }),
  },
  updatedAt: {
    getWhere: (updatedAt) => Ok({ updatedAt }),
    getOrderBy: (updatedAt) => Ok({ updatedAt }),
  },
}) {
  constructor(protected readonly prisma: PrismaService) {
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
        maps: { orderBy: { imageId: "asc" }, include: { image: {include:{file: true}} } },
      },
    });
    return rows?.maps.map((map) => map.image);
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<
    | "createdAt"
    | "updatedAt"
    | "title"
    | "details"
    | "durationInfo"
    | "marathonYear"
    | "shownStartingAt"
  >): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.MarathonHourDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: Record<string, never> }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).marathonHour.findMany(params)
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).marathonHour.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
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
