import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import type { DateTime } from "luxon";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { SimpleUniqueParam } from "#repositories/shared.js";

import {
  buildConfigurationOrder,
  buildConfigurationWhere,
} from "./configurationRepositoryUtils.js";

const configurationStringKeys = ["key", "value"] as const;
type ConfigurationStringKey = (typeof configurationStringKeys)[number];

const configurationDateKeys = [
  "validAfter",
  "validUntil",
  "createdAt",
  "updatedAt",
] as const;
type ConfigurationDateKey = (typeof configurationDateKeys)[number];

export type ConfigurationFilters = FilterItems<
  never,
  ConfigurationDateKey,
  never,
  never,
  never,
  ConfigurationStringKey
>;

import { prismaToken } from "#prisma";

@Service([prismaToken])
export class ConfigurationRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders
  findConfigurationByUnique(param: SimpleUniqueParam) {
    return this.prisma.configuration.findUnique({ where: param });
  }

  findConfigurations(
    filters: readonly ConfigurationFilters[] | null | undefined,
    order: readonly [key: string, sort: SortDirection][] | null | undefined,
    limit?: number  ,
    offset?: number  
  ) {
    const where = buildConfigurationWhere(filters);
    const orderBy = buildConfigurationOrder(order);

    return this.prisma.configuration.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });
  }

  findConfigurationByKey(key: string, at: Date | undefined) {
    return this.prisma.configuration.findFirst({
      where: {
        key,
        AND: at
          ? [
              {
                OR: [{ validAfter: null }, { validAfter: { lte: at } }],
              },
              {
                OR: [{ validUntil: null }, { validUntil: { gte: at } }],
              },
            ]
          : [],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Mutators

  async createConfiguration({
    key,
    value,
    validAfter,
    validUntil,
  }: {
    key: string;
    value: string;
    validAfter: DateTime | null;
    validUntil: DateTime | null;
  }) {
    const validAfterDate = validAfter?.toJSDate() ?? null;
    const validUntilDate = validUntil?.toJSDate() ?? null;

    const existing = await this.prisma.configuration.findFirst({
      where: {
        key,
        value,
        validAfter: validAfterDate,
        validUntil: validUntilDate,
      },
    });

    if (existing) {
      return existing;
    }
    return this.prisma.configuration.create({
      data: {
        key,
        value,
        validAfter: validAfterDate,
        validUntil: validUntilDate,
      },
    });
  }

  async bulkCreateConfigurations(
    configurations: {
      key: string;
      value: string;
      validAfter: DateTime | null;
      validUntil: DateTime | null;
    }[]
  ) {
    const existingConfigurations = await Promise.all(
      configurations.map(async (configuration) => {
        const existing = await this.prisma.configuration.findFirst({
          where: {
            key: configuration.key,
            value: configuration.value,
            validAfter: configuration.validAfter?.toJSDate() ?? null,
            validUntil: configuration.validUntil?.toJSDate() ?? null,
          },
        });

        return [configuration, existing] as const;
      })
    );

    const newConfigurations = existingConfigurations.filter(
      ([_, existing]) => !existing
    );

    return this.prisma.configuration.createMany({
      data: newConfigurations.map(([configuration]) => ({
        key: configuration.key,
        value: configuration.value,
        validAfter: configuration.validAfter?.toJSDate() ?? null,
        validUntil: configuration.validUntil?.toJSDate() ?? null,
      })),
    });
  }

  deleteConfiguration(uuid: string) {
    try {
      return this.prisma.configuration.delete({ where: { uuid } });
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
