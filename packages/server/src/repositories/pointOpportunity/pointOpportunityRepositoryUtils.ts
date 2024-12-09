import type { Prisma } from "@prisma/client";
import { parseGlobalId, SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type {
  PointOpportunityFilters,
  PointOpportunityOrderKeys,
} from "./PointOpportunityRepository.ts";

export function buildPointOpportunityOrder(
  order:
    | readonly [key: PointOpportunityOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.PointOpportunityOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "name":
      case "opportunityDate":
      case "type":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "marathonUuid": {
        orderBy.marathon = {
          year: sort === SortDirection.asc ? "asc" : "desc",
        };
        break;
      }
      default: {
        key satisfies never;
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  return orderBy;
}

export function buildPointOpportunityWhere(
  filters: readonly PointOpportunityFilters[] | null | undefined
) {
  const where: Prisma.PointOpportunityWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "name": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "marathonUuid": {
        where.marathon = {
          uuid: oneOfFilterToPrisma(
            {
              ...filter,
              value: filter.value.map((v) => parseGlobalId(v).unwrap().id),
            },
            false
          ),
        };
        break;
      }
      case "type": {
        where[filter.field] = oneOfFilterToPrisma(filter, false);
        break;
      }
      case "opportunityDate":
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
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
  return where;
}
