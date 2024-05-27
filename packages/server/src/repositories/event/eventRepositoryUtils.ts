import type { Prisma } from "@prisma/client";
import type { FilterItem } from "@ukdanceblue/common";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { EventFilters, EventOrderKeys } from "./EventRepository.ts";

export function buildEventOrder(
  order:
    | readonly [key: EventOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.EventOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "title":
      case "description":
      case "summary":
      case "location":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "occurrence":
      case "occurrenceStart":
      case "occurrenceEnd": {
        // Stuck handling these manually in JS because Prisma doesn't support
        // sorting by a field on a 1:n relation.
        // See https://github.com/prisma/prisma/issues/5837
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  return orderBy;
}

export function buildEventWhere(
  filters: readonly EventFilters[] | null | undefined
) {
  const where: Prisma.EventWhereInput = {
    eventOccurrences: {},
  };

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "title":
      case "description":
      case "summary":
      case "location": {
        where.description = stringFilterToPrisma(filter);
        break;
      }
      case "occurrence":
      case "occurrenceStart": {
        where.eventOccurrences = {
          some: {
            date: dateFilterToPrisma(filter),
          },
        };
        break;
      }
      case "occurrenceEnd": {
        where.eventOccurrences = {
          some: {
            endDate: dateFilterToPrisma(filter),
          },
        };
        break;
      }
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      default: {
        throw new Error(
          `Unsupported filter key: ${String(
            (filter as FilterItem<never, never>).field
          )}`
        );
      }
    }
  }
  return where;
}
