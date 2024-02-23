import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import type { EventFilters } from "./EventRepository.ts";

export function buildEventOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.EventOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
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

export function buildEventWhere(
  filters: readonly EventFilters[] | null | undefined
) {
  const where: Prisma.EventWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      default: {
        throw new Error(`Unsupported filter key: ${filter.field}`);
      }
    }
  }
  return where;
}
