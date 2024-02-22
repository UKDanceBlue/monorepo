import type { EventFilters } from "./EventRepository.ts";
import type { Event, Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import { buildFilter } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

export function buildEventOrder(
  order: string,
  direction: SortDirection
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
  filters: EventFilters[]
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
