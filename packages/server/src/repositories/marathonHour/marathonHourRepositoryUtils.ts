import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { SortDirection } from "@ukdanceblue/common";

import type {
  MarathonHourFilters,
  MarathonHourOrderKeys,
} from "./MarathonHourRepository.ts";
import type { Prisma } from "@prisma/client";



export function buildMarathonHourOrder(
  order:
    | readonly [key: MarathonHourOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.MarathonHourOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "title":
      case "details":
      case "durationInfo":
      case "shownStartingAt":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "marathonYear": {
        orderBy.marathon = {
          year: sort === SortDirection.asc ? "asc" : "desc",
        };
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  return orderBy;
}

export function buildMarathonHourWhere(
  filters: readonly MarathonHourFilters[] | null | undefined
) {
  const where: Prisma.MarathonHourWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "title":
      case "details":
      case "durationInfo": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "marathonYear": {
        where.marathon = { year: oneOfFilterToPrisma(filter) };
        break;
      }
      case "shownStartingAt":
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
