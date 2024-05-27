import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

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
) {
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
      default: {
        throw new Error(`Unsupported sort key: ${key}`);
      }
    }
  }
  return orderBy;
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
