import type { Prisma } from "@prisma/client";
import type { AbstractStringFilterItem } from "@ukdanceblue/common";
import { StringComparator } from "@ukdanceblue/common";

export function stringFilterToPrisma(
  filter: AbstractStringFilterItem<never>,
): Prisma.StringFilter {
  switch (filter.comparison) {
    case StringComparator.EQUALS: {
      if (filter.negate) {
        return { not: { equals: filter.value } };
      }
      return { equals: filter.value };
    }
    case StringComparator.STARTS_WITH: {
      if (filter.negate) {
        return { not: { startsWith: filter.value } };
      }
      return { startsWith: filter.value };
    }
    case StringComparator.ENDS_WITH: {
      if (filter.negate) {
        return { not: { endsWith: filter.value } };
      }
      return { endsWith: filter.value };
    }
    case StringComparator.SUBSTRING: {
      if (filter.negate) {
        return { not: { contains: filter.value } };
      }
      return { contains: filter.value };
    }
    case StringComparator.REGEX: {
      if (filter.negate) {
        return { not: { regexp: filter.value } };
      }
      return { regexp: filter.value };
    }
}
