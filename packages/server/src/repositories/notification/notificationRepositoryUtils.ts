import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import type { NotificationFilters } from "./NotificationRepository.ts";

export function buildNotificationOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.NotificationOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${key}`);
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
      default: {
        throw new Error(`Unsupported filter key: ${filter.field}`);
      }
    }
  }
  return where;
}
