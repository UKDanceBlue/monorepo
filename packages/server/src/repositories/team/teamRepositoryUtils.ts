import type { Prisma } from "@prisma/client";

import {
  dateFilterToSql,
  oneOfFilterToSql,
  stringFilterToSql,
} from "../../lib/prisma-utils/gqlFilterToSql.js";

import type { TeamFilters } from "./TeamRepository.ts";

export function buildTeamWhere(
  filters: readonly TeamFilters[] | null | undefined
) {
  const where: Prisma.Sql[] = [];

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "createdAt":
      case "updatedAt": {
        where.push(dateFilterToSql(filter));
        break;
      }
      case "marathonYear":
      case "type":
      case "legacyStatus": {
        where.push(oneOfFilterToSql(filter));
        break;
      }
      case "name": {
        where.push(stringFilterToSql(filter));
        break;
      }
      case "totalPoints": {
        // Handled by the query in the repository
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
