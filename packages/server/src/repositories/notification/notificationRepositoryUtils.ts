import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type {
  NotificationFilters,
  NotificationOrderKeys,
} from "./NotificationRepository.ts";

export function buildNotificationOrder(
  order:
    | readonly [key: NotificationOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.NotificationOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "title":
      case "body":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  return orderBy;
}

export function buildNotificationWhere(
  filters: readonly NotificationFilters[] | null | undefined
) {
  const where: Prisma.NotificationWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "title":
      case "body": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      default: {
        throw new Error(
          `Unsupported filter key: ${String(
            (filter as { field?: unknown } | undefined)?.field
          )}`
        );
      }
    }
  }
  return where;
}
