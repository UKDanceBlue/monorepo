import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { DeviceFilters } from "./DeviceRepository.js";

export function buildDeviceOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.DeviceOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "expoPushToken":
      case "lastSeen":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${key}`);
      }
    }
  }
  return orderBy;
}

export function buildDeviceWhere(
  filters: readonly DeviceFilters[] | null | undefined
) {
  const where: Prisma.DeviceWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "expoPushToken": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "lastSeen": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
    }
  }
  return where;
}
