import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type {
  FieldsOfListQueryArgs,
  ListPointEntriesArgs,
} from "@ukdanceblue/common";
import { Ok } from "ts-results-es";

import { prismaToken } from "#lib/typediTokens.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";
import type {
  AsyncRepositoryResult,
  SimpleUniqueParam,
} from "#repositories/shared.js";

type UniquePointEntryParam = SimpleUniqueParam;

@Service([prismaToken])
export class PointEntryRepository extends buildDefaultRepository<
  PrismaClient["pointEntry"],
  SimpleUniqueParam,
  FieldsOfListQueryArgs<ListPointEntriesArgs>
>("PointEntry", {
  createdAt: {
    getWhere: (createdAt) => Ok({ createdAt }),
    getOrderBy: (createdAt) => Ok({ createdAt }),
  },
  updatedAt: {
    getWhere: (updatedAt) => Ok({ updatedAt }),
    getOrderBy: (updatedAt) => Ok({ updatedAt }),
  },
}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(by: SimpleUniqueParam) {
    return PointEntryRepository.simpleUniqueToWhere(by);
  }

  findPointEntryByUnique(param: UniquePointEntryParam) {
    return this.prisma.pointEntry.findUnique({ where: param });
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

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<"createdAt" | "updatedAt">): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.PointEntryDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: Record<string, never> }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).pointEntry.findMany(params)
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).pointEntry.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
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
