import { Service } from "@freshgum/typedi";
import type { PointOpportunityType } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";

type UniquePointOpportunityParam = SimpleUniqueParam;

import type { DefaultArgs } from "@prisma/client/runtime/library";
import type {
  FieldsOfListQueryArgs,
  ListPointOpportunitiesArgs,
} from "@ukdanceblue/common";
import { Ok } from "ts-results-es";

import { PrismaService } from "#lib/prisma.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";
import { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import {
  type AsyncRepositoryResult,
  SimpleUniqueParam,
} from "#repositories/shared.js";

@Service([PrismaService])
export class PointOpportunityRepository extends buildDefaultRepository<
  PrismaClient["pointOpportunity"],
  SimpleUniqueParam,
  FieldsOfListQueryArgs<ListPointOpportunitiesArgs>
>("PointOpportunity", {
  name: {
    getWhere: (name) => Ok({ name }),
    getOrderBy: (name) => Ok({ name }),
    searchable: true,
  },
  type: {
    getWhere: (type) => Ok({ type }),
    getOrderBy: (type) => Ok({ type }),
  },
  opportunityDate: {
    getWhere: (opportunityDate) => Ok({ opportunityDate }),
    getOrderBy: (opportunityDate) => Ok({ opportunityDate }),
  },
  marathonYear: {
    getWhere: (marathonYear) => Ok({ marathon: { year: marathonYear } }),
    getOrderBy: (marathonYear) => Ok({ marathon: { year: marathonYear } }),
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
    return PointOpportunityRepository.simpleUniqueToWhere(by);
  }

  findPointOpportunityByUnique(param: UniquePointOpportunityParam) {
    return this.prisma.pointOpportunity.findUnique({ where: param });
  }

  getEventForPointOpportunity(param: UniquePointOpportunityParam) {
    return this.prisma.pointOpportunity
      .findUnique({
        where: param,
      })
      .event();
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<
    | "createdAt"
    | "updatedAt"
    | "name"
    | "opportunityDate"
    | "type"
    | "marathonYear"
  >): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.PointOpportunityDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: Record<string, never> }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).pointOpportunity.findMany(params)
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).pointOpportunity.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
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
