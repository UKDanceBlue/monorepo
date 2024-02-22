import type { MembershipFilters } from "./MembershipRepository.ts";
import type { Membership, Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import { buildFilter } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

export function buildMembershipOrder(
  order: string,
  direction: SortDirection
) {
  const orderBy: Prisma.MembershipOrderByWithRelationInput = {};

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

export function buildMembershipWhere(
  filters: MembershipFilters[]
) {
  const where: Prisma.MembershipWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      default: {
        throw new Error(`Unsupported filter key: ${filter.field}`);
      }
    }
  }
  return where;
}
