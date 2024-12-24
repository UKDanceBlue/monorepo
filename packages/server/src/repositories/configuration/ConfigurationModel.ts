import { ConfigurationNode } from "@ukdanceblue/common";

import { buildDefaultDatabaseModel } from "#repositories/DefaultRepository.js";
import { configuration } from "#schema/tables/misc.sql.js";

export class ConfigurationModel extends buildDefaultDatabaseModel(
  configuration,
  ConfigurationNode
) {
  protected rowToInitParams(
    row: typeof configuration.$inferSelect
  ): Parameters<typeof ConfigurationNode.init> {
    return [
      {
        id: row.uuid,
        key: row.key,
        value: row.value,
        validAfter: row.validAfter,
        validUntil: row.validUntil,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    ];
  }
}
