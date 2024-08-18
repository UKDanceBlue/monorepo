import { SortDirection } from "@ukdanceblue/common";

import type { PointEntryFilters } from "./PointEntryRepository.ts";
import type { Prisma } from "@prisma/client";

export function buildPointEntryOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.PointEntryOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
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

export function buildPointEntryWhere(
  filters: readonly PointEntryFilters[] | null | undefined
) {
  const where: Prisma.PointEntryWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      default: {
        throw new Error(`Unsupported filter key: ${filter.field}`);
      }
    }
  }
  return where;
}
