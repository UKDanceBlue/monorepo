import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type {
  NotificationDeliveryFilters,
  NotificationDeliveryOrderKeys,
} from "./NotificationDeliveryRepository.js";

export function buildNotificationDeliveryOrder(
  order:
    | readonly [key: NotificationDeliveryOrderKeys, sort: SortDirection][]
    | null
    | undefined
) {
  const orderBy: Prisma.NotificationDeliveryOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "sentAt":
      case "receiptCheckedAt":
      case "deliveryError":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  return orderBy;
}

export function buildNotificationDeliveryWhere(
  filters: readonly NotificationDeliveryFilters[] | null | undefined
) {
  const where: Prisma.NotificationDeliveryWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "deliveryError": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "sentAt":
      case "receiptCheckedAt":
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
