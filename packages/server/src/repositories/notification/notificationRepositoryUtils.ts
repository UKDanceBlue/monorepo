import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

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
      case "createdAt":
      case "updatedAt":
      case "title":
      case "body":
      case "deliveryIssue":
      case "deliveryIssueAcknowledgedAt":
      case "sendAt":
      case "startedSendingAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      default: {
        key satisfies never;
        throw new Error(`Unsupported filter field: ${JSON.stringify(key)}`);
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
      case "deliveryIssue": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "title":
      case "body": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "createdAt":
      case "updatedAt":
      case "sendAt":
      case "startedSendingAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      default: {
        filter satisfies never;
        throw new Error(`Unsupported filter field: ${JSON.stringify(filter)}`);
      }
    }
  }
  return where;
}
