import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { SortDirection } from "@ukdanceblue/common";

import type {
  PointOpportunityFilters,
  PointOpportunityOrderKeys,
} from "./PointOpportunityRepository.ts";
import type { Prisma } from "@prisma/client";



export function buildPointOpportunityOrder(
  order:
    | readonly [key: PointOpportunityOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.PointOpportunityOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "name":
      case "opportunityDate":
      case "type":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
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
      case "name": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "type": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "opportunityDate":
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      default: {
        throw new Error(
          `Unsupported filter key: ${String(
            (filter as { field?: string } | undefined)?.field
          )}`
        );
      }
    }
  }
  return where;
}
