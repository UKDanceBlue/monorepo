import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import {
  dateFilterToPrisma,
  numericFilterToPrisma,
  stringFilterToPrisma,
} from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { ImageFilters } from "./ImageRepository.ts";

export function buildImageOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.ImageOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "width":
      case "height":
      case "createdAt":
      case "alt":
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

export function buildImageWhere(
  filters: readonly ImageFilters[] | null | undefined
) {
  const where: Prisma.ImageWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "width":
      case "height": {
        where[filter.field] = numericFilterToPrisma(filter);
        break;
      }
      case "alt": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
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
