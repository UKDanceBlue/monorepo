import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { and, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import type { DateTime } from "luxon";

import { db } from "#db";
import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { prismaToken } from "#lib/typediTokens.js";
import { buildDefaultRepository } from "#repositories/DefaultRepository.js";
import { SimpleUniqueParam } from "#repositories/shared.js";
import { configuration } from "#schema/tables/misc.sql.js";

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

@Service([])
export class ConfigurationRepository extends buildDefaultRepository(
  configuration,
  {},
  {} as SimpleUniqueParam
) {
  public uniqueToWhere(by: SimpleUniqueParam) {
    return "uuid" in by
      ? eq(configuration.uuid, by.uuid)
      : eq(configuration.id, by.id);
  }

  findConfigurationByKey(key: string, at: DateTime | undefined) {
    return db.query.configuration.findFirst({
      where: and(
        eq(configuration.key, key),
        ...(at
          ? [
              or(
                isNull(configuration.validAfter),
                lte(configuration.validAfter, at)
              ),
              or(
                isNull(configuration.validUntil),
                gte(configuration.validUntil, at)
              ),
            ]
          : [])
      ),
      orderBy: desc(configuration.createdAt),
    });
  }

  // Mutators
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
