import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import type { CommitteeFilters } from "./CommitteeRepository.js";
import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";


export function buildCommitteeOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.CommitteeOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "identifier":
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

export function buildCommitteeWhere(
  filters: readonly CommitteeFilters[] | null | undefined
) {
  const where: Prisma.CommitteeWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "identifier": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
    }
  }
  return where;
}
