import type { Prisma } from "@prisma/client";
import { parseGlobalId, SortDirection } from "@ukdanceblue/common";
import type { InvalidArgumentError } from "@ukdanceblue/common/error";
import { ActionDeniedError } from "@ukdanceblue/common/error";
import { Err, Ok, Result } from "ts-results-es";

import {
  dateFilterToPrisma,
  numericFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type {
  FundraisingEntryFilters,
  FundraisingEntryOrderKeys,
} from "./FundraisingRepository.js";

export function buildFundraisingEntryOrder(
  order:
    | readonly [key: FundraisingEntryOrderKeys, sort: SortDirection][]
    | null
    | undefined
): Result<
  Prisma.FundraisingEntryWithMetaOrderByWithRelationInput,
  ActionDeniedError
> {
  const orderBy: Prisma.FundraisingEntryWithMetaOrderByWithRelationInput = {};
  const dbFundsEntryOrderBy: Prisma.DBFundsFundraisingEntryOrderByWithRelationInput =
    {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "donatedOn": {
        dbFundsEntryOrderBy.date = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "amountUnassigned": {
        orderBy.unassigned = sort === SortDirection.asc ? "asc" : "desc";
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
    orderBy.dbFundsEntry = dbFundsEntryOrderBy;
  }

  return Ok(orderBy);
}

export function buildFundraisingEntryWhere(
  filters: readonly FundraisingEntryFilters[] | null | undefined
): Result<
  Prisma.FundraisingEntryWithMetaWhereInput,
  ActionDeniedError | InvalidArgumentError
> {
  const where: Prisma.FundraisingEntryWithMetaWhereInput = {};
  const dbFundsEntryWhere: Prisma.DBFundsFundraisingEntryWhereInput[] = [];

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "updatedAt":
      case "createdAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      case "amountUnassigned": {
        where.unassigned = numericFilterToPrisma(filter);
        break;
      }
      case "amount": {
        dbFundsEntryWhere.push({
          [filter.field]: numericFilterToPrisma(filter),
        });
        break;
      }
      case "donatedOn": {
        dbFundsEntryWhere.push({
          date: dateFilterToPrisma(filter),
        });
        break;
      }
      case "donatedTo":
      case "donatedBy": {
        dbFundsEntryWhere.push({
          [filter.field]: stringFilterToPrisma(filter),
        });
        break;
      }
      case "teamId": {
        const parsed = Result.all(
          filter.value.map((val) => parseGlobalId(val).map(({ id }) => id))
        );
        if (parsed.isErr()) {
          return parsed;
        }
        dbFundsEntryWhere.push({
          dbFundsTeam: {
            teams: {
              some: {
                uuid: oneOfFilterToPrisma({
                  ...filter,
                  value: parsed.value,
                }),
              },
            },
          },
        });
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
    where.dbFundsEntry = { AND: dbFundsEntryWhere };
  }

  return Ok(where);
}
