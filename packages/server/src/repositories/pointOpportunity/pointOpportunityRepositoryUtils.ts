import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import type { PointOpportunityFilters } from "./PointOpportunityRepository.ts";

export function buildPointOpportunityOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.PointOpportunityOrderByWithRelationInput = {};

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

export function buildPointOpportunityWhere(
  filters: readonly PointOpportunityFilters[] | null | undefined
) {
  const where: Prisma.PointOpportunityWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      default: {
        throw new Error(`Unsupported filter key: ${filter.field}`);
      }
    }
  }
  return where;
}
