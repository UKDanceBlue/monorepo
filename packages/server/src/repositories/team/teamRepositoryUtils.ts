import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  numericFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { TeamFilters, TeamOrderKeys } from "./TeamRepository.ts";

export function buildTeamOrder(
  order: readonly [key: TeamOrderKeys, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.TeamsWithTotalPointsOrderByWithRelationInput[] = [];

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "totalPoints":
      case "type":
      case "marathonYear":
      case "legacyStatus":
      case "name":
      case "createdAt":
      case "updatedAt": {
        orderBy.push({
          [key]: sort === SortDirection.asc ? "asc" : "desc",
        });
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
  const where: Prisma.TeamsWithTotalPointsWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      case "marathonYear": {
        where["marathon"] = {
          year: oneOfFilterToPrisma(filter),
        };
        break;
      }
      case "type":
      case "legacyStatus": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "totalPoints": {
        where[filter.field] = numericFilterToPrisma(filter);
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
