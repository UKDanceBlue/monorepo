import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import { ActionDeniedError } from "@ukdanceblue/common/error";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import type {
  FundraisingEntryFilters,
  FundraisingEntryOrderKeys,
} from "./FundraisingRepository.js";
import {
  dateFilterToPrisma,
  numericFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

export function buildFundraisingEntryOrder(
  order:
    | readonly [key: FundraisingEntryOrderKeys, sort: SortDirection][]
    | null
    | undefined
): Result<Prisma.FundraisingEntryOrderByWithRelationInput, ActionDeniedError> {
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
      case "teamId": {
        return Err(new ActionDeniedError("Cannot sort by teamId"));
      }
      default: {
        key satisfies never;
        return Err(
          new ActionDeniedError(`Unsupported sort key: ${String(key)}`)
        );
      }
    }
  }

  if (Object.keys(dbFundsEntryOrderBy).length > 0) {
    orderBy["dbFundsEntry"] = dbFundsEntryOrderBy;
  }

  return Ok(orderBy);
}

export function buildFundraisingEntryWhere(
  filters: readonly FundraisingEntryFilters[] | null | undefined
): Result<Prisma.FundraisingEntryWhereInput, ActionDeniedError> {
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
      case "teamId": {
        dbFundsEntryWhere.dbFundsTeam = {
          teams: { some: { uuid: oneOfFilterToPrisma(filter) } },
        };
        break;
      }
      default: {
        filter satisfies never;
        return Err(
          new ActionDeniedError(
            `Unsupported filter key: ${String((filter as { field?: string } | undefined)?.field)}`
          )
        );
      }
    }
  }

  if (Object.keys(dbFundsEntryWhere).length > 0) {
    where["dbFundsEntry"] = dbFundsEntryWhere;
  }

  return Ok(where);
}
