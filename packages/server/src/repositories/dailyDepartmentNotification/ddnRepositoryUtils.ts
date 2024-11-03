import type { Prisma } from "@prisma/client";
import type { FilterItem } from "@ukdanceblue/common";
import type { SortDirection } from "@ukdanceblue/common";

import type {
  DailyDepartmentNotificationFilters,
  DailyDepartmentNotificationOrderKeys,
} from "./DDNRepository.js";

export function buildDailyDepartmentNotificationOrder(
  order:
    | readonly [
        key: DailyDepartmentNotificationOrderKeys,
        sort: SortDirection,
      ][]
    | null
    | undefined
) {
  const orderBy: Prisma.DailyDepartmentNotificationOrderByWithRelationInput =
    {};

  for (const [key, _sort] of order ?? []) {
    switch (key) {
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  return orderBy;
}

export function buildDailyDepartmentNotificationWhere(
  filters: readonly DailyDepartmentNotificationFilters[] | null | undefined
) {
  const where: Prisma.DailyDepartmentNotificationWhereInput = {};
  for (const filter of filters ?? []) {
    switch (filter.field) {
      default: {
        throw new Error(
          `Unsupported filter key: ${String(
            (filter as FilterItem<never, never>).field
          )}`
        );
      }
    }
  }
  return where;
}
