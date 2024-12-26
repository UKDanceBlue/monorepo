import { Service } from "@freshgum/typedi";
import { and, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import type { DateTime } from "luxon";

import { drizzleToken } from "#lib/typediTokens.js";
import { buildDefaultRepository } from "#repositories/DefaultRepository.js";
import { SimpleUniqueParam } from "#repositories/shared.js";
import { configuration } from "#schema/tables/misc.sql.js";

import { ConfigurationModel } from "./ConfigurationModel.js";

@Service([drizzleToken])
export class ConfigurationRepository extends buildDefaultRepository(
  configuration,
  ConfigurationModel,
  {
    key: configuration.key,
    value: configuration.value,
    validAfter: configuration.validAfter,
    validUntil: configuration.validUntil,
    createdAt: configuration.createdAt,
    updatedAt: configuration.updatedAt,
  },
  {} as SimpleUniqueParam
) {
  public uniqueToWhere(by: SimpleUniqueParam) {
    return "uuid" in by
      ? eq(configuration.uuid, by.uuid)
      : eq(configuration.id, by.id);
  }

  findConfigurationByKey(key: string, at: DateTime | undefined) {
    return this.handleQueryError(
      this.db.query.configuration.findFirst({
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
      }),
      { what: `Configuration with key ${key}`, where: "findConfigurationByKey" }
    ).map((row) => new ConfigurationModel(row));
  }
}
