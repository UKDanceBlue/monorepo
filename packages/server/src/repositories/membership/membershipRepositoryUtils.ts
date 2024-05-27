import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import { dateFilterToPrisma } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { MembershipFilters } from "./MembershipRepository.ts";

export function buildMembershipOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.MembershipOrderByWithRelationInput = {};

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

export function buildMembershipWhere(
  filters: readonly MembershipFilters[] | null | undefined
) {
  const where: Prisma.MembershipWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
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
