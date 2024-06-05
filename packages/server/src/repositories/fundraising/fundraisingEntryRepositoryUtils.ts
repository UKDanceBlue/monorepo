import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  numericFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type {
  FundraisingEntryFilters,
  FundraisingEntryOrderKeys,
} from "./FundraisingEntryRepository.ts";

export function buildFundraisingEntryOrder(
  order:
    | readonly [key: FundraisingEntryOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.FundraisingEntryOrderByWithRelationInput = {};
  const dbFundsEntryOrderBy: Prisma.FundraisingEntryOrderByWithRelationInput["dbFundsEntry"] =
    {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "donatedOn": {
        dbFundsEntryOrderBy["date"] =
          sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "amount":
      case "donatedTo":
      case "donatedBy": {
        dbFundsEntryOrderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      default: {
        key satisfies never;
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }

  if (Object.keys(dbFundsEntryOrderBy).length > 0) {
    orderBy["dbFundsEntry"] = dbFundsEntryOrderBy;
  }

  return orderBy;
}

export function buildFundraisingEntryWhere(
  filters: readonly FundraisingEntryFilters[] | null | undefined
) {
  const where: Prisma.FundraisingEntryWhereInput = {};
  const dbFundsEntryWhere: Prisma.FundraisingEntryWhereInput["dbFundsEntry"] =
    {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "updatedAt":
      case "createdAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      case "amount": {
        dbFundsEntryWhere[filter.field] = numericFilterToPrisma(filter);
        break;
      }
      case "donatedOn": {
        dbFundsEntryWhere["date"] = dateFilterToPrisma(filter);
        break;
      }
      case "donatedTo":
      case "donatedBy": {
        dbFundsEntryWhere[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      default: {
        filter satisfies never;
        throw new Error(
          `Unsupported filter key: ${String(
            (filter as { field?: string } | undefined)?.field
          )}`
        );
      }
    }
  }

  if (Object.keys(dbFundsEntryWhere).length > 0) {
    where["dbFundsEntry"] = dbFundsEntryWhere;
  }

  return where;
}
