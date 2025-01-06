import { Service } from "@freshgum/typedi";
import type { PointOpportunityType } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";

type UniquePointOpportunityParam = SimpleUniqueParam;

import type {
  FieldsOfListQueryArgs,
  ListPointOpportunitiesArgs,
} from "@ukdanceblue/common";

import { prismaToken } from "#lib/typediTokens.js";
import { buildDefaultRepository } from "#repositories/Default.js";
import { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import { SimpleUniqueParam } from "#repositories/shared.js";

@Service([prismaToken])
export class PointOpportunityRepository extends buildDefaultRepository<
  PrismaClient["pointOpportunity"],
  SimpleUniqueParam,
  FieldsOfListQueryArgs<ListPointOpportunitiesArgs>
>("PointOpportunity", {}) {
  constructor(protected readonly prisma: PrismaClient) {
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
