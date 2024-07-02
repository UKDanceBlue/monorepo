import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import type Result from "true-myth/result";
import { err, ok } from "true-myth/result";

import { ActionDeniedError } from "../../lib/error/control.js";
import {
  dateFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { PersonFilters, PersonOrderKeys } from "./PersonRepository.js";

export function buildPersonOrder(
  order:
    | readonly [key: PersonOrderKeys, sort: SortDirection][]
    | null
    | undefined
): Result<Prisma.PersonOrderByWithRelationInput, ActionDeniedError> {
  const orderBy: Prisma.PersonOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "name":
      case "email":
      case "linkblue":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "committeeRole":
      case "committeeName":
      case "dbRole":
      default: {
        key satisfies "committeeRole" | "committeeName" | "dbRole";
        return err(
          new ActionDeniedError(
            `Unsupported filter key: ${String((key as { field?: string } | undefined)?.field)}`
          )
        );
      }
    }
  }
  return ok(orderBy);
}
export function buildPersonWhere(
  filters: readonly PersonFilters[] | null | undefined
) {
  const where: Prisma.PersonWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "name":
      case "email":
      case "linkblue": {
        where[filter.field] = stringFilterToPrisma(filter);
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
