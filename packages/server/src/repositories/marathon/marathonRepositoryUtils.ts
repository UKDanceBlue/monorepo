import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type {
  MarathonFilters,
  MarathonOrderKeys,
} from "./MarathonRepository.ts";

export function buildMarathonOrder(
  order:
    | readonly [key: MarathonOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.MarathonOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "year":
      case "startDate":
      case "endDate":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  return orderBy;
}

export function buildMarathonWhere(
  filters: readonly MarathonFilters[] | null | undefined
) {
  const where: Prisma.MarathonWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "year": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "startDate":
      case "endDate":
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
