import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { ConfigurationFilters } from "./ConfigurationRepository.js";

export function buildConfigurationOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.ConfigurationOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "key":
      case "value":
      case "validAfter":
      case "validUntil":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${key}`);
      }
    }
  }
  return orderBy;
}

export function buildConfigurationWhere(
  filters: readonly ConfigurationFilters[] | null | undefined
) {
  const where: Prisma.ConfigurationWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "key":
      case "value": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "validAfter":
      case "validUntil": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
    }
  }
  return where;
}
