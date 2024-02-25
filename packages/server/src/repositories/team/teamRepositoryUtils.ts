import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { TeamFilters, TeamOrderKeys } from "./TeamRepository.ts";

export function buildTeamOrder(
  order: readonly [key: TeamOrderKeys, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.TeamOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "totalPoints": {
        // Handled by the repository
        break;
      }
      case "type":
      case "marathonYear":
      case "legacyStatus":
      case "name":
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

export function buildTeamWhere(
  filters: readonly TeamFilters[] | null | undefined
) {
  const where: Prisma.TeamWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      case "type":
      case "marathonYear":
      case "legacyStatus": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "name": {
        where[filter.field] = stringFilterToPrisma(filter);
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
