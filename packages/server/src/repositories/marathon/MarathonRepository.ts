import { Service } from "@freshgum/typedi";
import { Marathon, MarathonHour, Prisma, PrismaClient } from "@prisma/client";
import { NotFoundError, optionOf } from "@ukdanceblue/common/error";
import { Err, Ok, Option, Result } from "ts-results-es";

import {
  handleRepositoryError,
  type RepositoryError,
  type SimpleUniqueParam,
} from "#repositories/shared.js";

export type UniqueMarathonParam = SimpleUniqueParam | { year: string };

import type {
  FieldsOfListQueryArgs,
  ListMarathonsArgs,
} from "@ukdanceblue/common";

import { prismaToken } from "#lib/typediTokens.js";
import { buildDefaultRepository } from "#repositories/Default.js";

@Service([prismaToken])
export class MarathonRepository extends buildDefaultRepository<
  PrismaClient["marathon"],
  SimpleUniqueParam,
  FieldsOfListQueryArgs<ListMarathonsArgs>
>("Marathon", {}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(by: SimpleUniqueParam) {
    return MarathonRepository.simpleUniqueToWhere(by);
  }

  async findMarathonByUnique(
    param: UniqueMarathonParam
  ): Promise<Result<Marathon, RepositoryError>> {
    try {
      const row = await this.prisma.marathon.findUnique({ where: param });
      if (!row) {
        return Err(new NotFoundError({ what: "Marathon" }));
      }
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  /**
   * Find the current marathon, if one exists
   *
   * A marathon is considered current if the current date is between the start and end dates
   */
  async findCurrentMarathon(): Promise<
    Result<Option<Marathon>, RepositoryError>
  > {
    try {
      const marathon = await this.prisma.marathon.findFirst({
        orderBy: { year: "desc" },
        where: { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
      });
      return Ok(optionOf(marathon));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  /**
   * Find the active marathon, if one exists
   *
   * A marathon is considered active if it is the most recent marathon by marathon year
   */
  async findActiveMarathon(): Promise<
    Result<Option<Marathon>, RepositoryError>
  > {
    try {
      const marathon = await this.prisma.marathon.findFirst({
        orderBy: { year: "desc" },
      });
      return Ok(optionOf(marathon));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getMarathonHours(
    param: UniqueMarathonParam
  ): Promise<Result<MarathonHour[], RepositoryError>> {
    try {
      const rows = await this.prisma.marathon.findUnique({
        where: param,
        include: { hours: true },
      });
      return Ok(rows?.hours ?? []);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async createMarathon({
    year,
    startDate,
    endDate,
  }: {
    year: string;
    startDate?: Date | undefined | null;
    endDate?: Date | undefined | null;
  }): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.create({
        data: {
          year,
          startDate,
          endDate,
        },
      });
      return Ok(marathon);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async updateMarathon(
    param: UniqueMarathonParam,
    {
      year,
      startDate,
      endDate,
    }: {
      year?: string;
      startDate?: Date | undefined | null;
      endDate?: Date | undefined | null;
    }
  ): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.update({
        where: param,
        data: {
          year,
          startDate,
          endDate,
        },
      });
      return Ok(marathon);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError({ what: "Marathon" }));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async deleteMarathon(
    param: UniqueMarathonParam
  ): Promise<Result<Marathon, RepositoryError>> {
    try {
      const marathon = await this.prisma.marathon.delete({ where: param });
      return Ok(marathon);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError({ what: "Marathon" }));
      } else {
        return handleRepositoryError(error);
      }
    }
  }
}
