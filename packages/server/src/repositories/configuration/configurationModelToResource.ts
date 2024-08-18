import { ConfigurationNode } from "@ukdanceblue/common";

import type { Configuration } from "@prisma/client";

export function configurationModelToResource(
  configuration: Configuration
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
