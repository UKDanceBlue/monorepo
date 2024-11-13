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
  const ddnOrderBy: Prisma.DailyDepartmentNotificationOrderByWithRelationInput =
    {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "amountUnassigned": {
        orderBy.unassigned = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "amount": {
        dbFundsEntryOrderBy.amount =
          sort === SortDirection.asc ? "asc" : "desc";
        ddnOrderBy.combinedAmount = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "donatedTo": {
        dbFundsEntryOrderBy.donatedTo =
          sort === SortDirection.asc ? "asc" : "desc";
        ddnOrderBy.comment = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "donatedBy": {
        dbFundsEntryOrderBy.donatedBy =
          sort === SortDirection.asc ? "asc" : "desc";
        ddnOrderBy.combinedDonorName =
          sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "donatedOn": {
        dbFundsEntryOrderBy.date = sort === SortDirection.asc ? "asc" : "desc";
        ddnOrderBy.pledgedDate = sort === SortDirection.asc ? "asc" : "desc";
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
    orderBy.entrySource = {
      dbFundsEntry: dbFundsEntryOrderBy,
      ddn: ddnOrderBy,
    };
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
  const ddnWhere: Prisma.DailyDepartmentNotificationWhereInput[] = [];

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
          amount: numericFilterToPrisma(filter),
        });
        ddnWhere.push({
          combinedAmount: numericFilterToPrisma(filter),
        });
        break;
      }
      case "donatedOn": {
        dbFundsEntryWhere.push({
          date: dateFilterToPrisma(filter),
        });
        ddnWhere.push({
          pledgedDate: dateFilterToPrisma(filter),
        });
        break;
      }
      case "donatedTo": {
        dbFundsEntryWhere.push({
          donatedTo: stringFilterToPrisma(filter),
        });
        ddnWhere.push({
          comment: stringFilterToPrisma(filter),
        });
        break;
      }
      case "donatedBy": {
        dbFundsEntryWhere.push({
          donatedBy: stringFilterToPrisma(filter),
        });
        ddnWhere.push({
          combinedDonorName: stringFilterToPrisma(filter),
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
            solicitationCode: {
              teams: {
                some: {
                  uuid: oneOfFilterToPrisma({
                    ...filter,
                    value: parsed.value,
                  }),
                },
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
    where.entrySource = {
      OR: [
        { dbFundsEntry: { AND: dbFundsEntryWhere } },
        { ddn: { AND: ddnWhere } },
      ],
    };
  }

  return Ok(where);
}
