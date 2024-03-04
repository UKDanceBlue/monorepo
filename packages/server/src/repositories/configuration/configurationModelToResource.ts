import type { Configuration } from "@prisma/client";
import { ConfigurationResource } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function configurationModelToResource(configuration: Configuration): ConfigurationResource {
  return ConfigurationResource.init({
    uuid: configuration.uuid,
    key: configuration.key,
    value: configuration.value,
    validAfter: configuration.validAfter ? DateTime.fromJSDate(configuration.validAfter) : null,
    validUntil: configuration.validUntil ? DateTime.fromJSDate(configuration.validUntil) : null,
    createdAt: configuration.createdAt,
    updatedAt: configuration.updatedAt,
  });
}