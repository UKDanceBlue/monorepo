import type { Configuration } from "@prisma/client";
import { ConfigurationNode } from "@ukdanceblue/common";

export function configurationModelToResource(
  configuration: Configuration
): ConfigurationNode {
  return ConfigurationNode.init({
    uuid: configuration.uuid,
    key: configuration.key,
    value: configuration.value,
    validAfter: configuration.validAfter,
    validUntil: configuration.validUntil,
    createdAt: configuration.createdAt,
    updatedAt: configuration.updatedAt,
  });
}
