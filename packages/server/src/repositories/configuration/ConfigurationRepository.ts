import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import type { DateTime } from "luxon";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

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

@Service()
export class ConfigurationRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders

  findConfigurations(
    filters: readonly ConfigurationFilters[] | null | undefined,
    order: readonly [key: string, sort: SortDirection][] | null | undefined,
    limit?: number | undefined,
    offset?: number | undefined
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
        AND: at ? [
          {
            OR: [
              { validAfter: null },
              { validAfter: { lte: at } },
            ],
          },
          {
            OR: [
              { validUntil: null },
              { validUntil: { gte: at } },
            ],
          },
        ] : [],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Mutators

  createConfiguration(
{ key, value, validAfter, validUntil }: { key: string; value: string; validAfter: DateTime | null; validUntil: DateTime | null; }  ) {
    return this.prisma.configuration.create({
      data: {
        key,
        value,
        validAfter: validAfter?.toJSDate() ?? null,
        validUntil: validUntil?.toJSDate() ?? null,
      },
    });
  }

  updateConfiguration(
    uuid: string,
    value?: string | undefined,
    validAfter?: DateTime | undefined | null,
    validUntil?: DateTime | undefined | null
  ) {
    return this.prisma.configuration.update({
      where: { uuid },
      data: {
        value,
        validAfter: validAfter === null ? null : validAfter?.toJSDate(),
        validUntil: validUntil === null ? null : validUntil?.toJSDate(),
      },
    });
  }

  deleteConfiguration(uuid: string) {
    return this.prisma.configuration.delete({ where: { uuid } });
  }
}
