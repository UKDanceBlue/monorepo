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

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "amountUnassigned": {
        orderBy.unassigned = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "amount":
      case "donatedTo":
      case "donatedBy":
      case "donatedOn":
      case "createdAt":
      case "batchType":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "solicitationCode": {
        orderBy.solicitationCodeText =
          sort === SortDirection.asc ? "asc" : "desc";
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

  return Ok(orderBy);
}

export function buildFundraisingEntryWhere(
  filters: readonly FundraisingEntryFilters[] | null | undefined
): Result<
  Prisma.FundraisingEntryWithMetaWhereInput,
  ActionDeniedError | InvalidArgumentError
> {
  const where: Prisma.FundraisingEntryWithMetaWhereInput = {};
  const entrySourceWhereWhere: (Prisma.DBFundsFundraisingEntryWhereInput &
    Prisma.DailyDepartmentNotificationWhereInput)[] = [];

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "donatedOn":
      case "updatedAt":
      case "createdAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      case "amount":
      case "amountUnassigned": {
        where.unassigned = numericFilterToPrisma(filter);
        break;
      }
      case "donatedTo":
      case "donatedBy": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "solicitationCode": {
        where.solicitationCodeText = stringFilterToPrisma(filter);
        break;
      }
      case "batchType": {
        where.batchType = oneOfFilterToPrisma(filter, false);
        break;
      }
      case "teamId": {
        const parsed = Result.all(
          filter.value.map((val) => parseGlobalId(val).map(({ id }) => id))
        );
        if (parsed.isErr()) {
          return parsed;
        }
        entrySourceWhereWhere.push({
          dbFundsTeam: {
            solicitationCode: {
              teams: {
                some: {
                  uuid: oneOfFilterToPrisma(
                    {
                      ...filter,
                      value: parsed.value,
                    },
                    false
                  ),
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

  if (Object.keys(entrySourceWhereWhere).length > 0) {
    where.OR = [
      {
        dbFundsEntry: {
          AND: entrySourceWhereWhere,
        },
      },
      {
        ddn: {
          AND: entrySourceWhereWhere,
        },
      },
    ];
  }

  return Ok(where);
}
