import { ConfigurationNode } from "@ukdanceblue/common";
import type { InferSelectModel } from "drizzle-orm";

import type { configuration as configurationModel } from "#schema/tables/misc.sql.js";

export function configurationModelToResource(
  configuration: InferSelectModel<typeof configurationModel>
): ConfigurationNode {
  return ConfigurationNode.init({
    id: configuration.uuid,
    key: configuration.key,
    value: configuration.value,
    validAfter: configuration.validAfter,
    validUntil: configuration.validUntil,
    createdAt: configuration.createdAt,
    updatedAt: configuration.updatedAt,
  });
}
