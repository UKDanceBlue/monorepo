import type { ImageFilters } from "./ImageRepository.ts";
import type { Image, Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import { buildFilter } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

export function buildImageOrder(
  order: string,
  direction: SortDirection
) {
  const orderBy: Prisma.ImageOrderByWithRelationInput = {};

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

export function buildImageWhere(
  filters: ImageFilters[]
) {
  const where: Prisma.ImageWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      default: {
        throw new Error(`Unsupported filter key: ${filter.field}`);
      }
    }
  }
  return where;
}
