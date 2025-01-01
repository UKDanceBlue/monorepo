import type { Configuration } from "@prisma/client";
import { ConfigurationNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function configurationModelToResource(
  configuration: Configuration
): ConfigurationNode {
  return ConfigurationNode.init({
    id: configuration.uuid,
    key: configuration.key,
    value: configuration.value,
    validAfter:
      configuration.validAfter && DateTime.fromJSDate(configuration.validAfter),
    validUntil:
      configuration.validUntil && DateTime.fromJSDate(configuration.validUntil),
    createdAt: DateTime.fromJSDate(configuration.createdAt),
    updatedAt: DateTime.fromJSDate(configuration.updatedAt),
  });
}
