import type { Prisma } from "@prisma/client";
import type {
  AbstractBooleanFilterItem,
  AbstractDateFilterItem,
  AbstractIsNullFilterItem,
  AbstractNumericFilterItem,
  AbstractOneOfFilterItem,
  AbstractStringFilterItem,
} from "@ukdanceblue/common";
import {
  IsComparator,
  NumericComparator,
  StringComparator,
} from "@ukdanceblue/common";

export type FilterItems<
  B extends string,
  D extends string,
  I extends string,
  N extends string,
  O extends string,
  S extends string,
> =
  | AbstractBooleanFilterItem<B>
  | AbstractDateFilterItem<D>
  | AbstractIsNullFilterItem<I>
  | AbstractNumericFilterItem<N>
  | AbstractOneOfFilterItem<O>
  | AbstractStringFilterItem<S>;

export function stringFilterToPrisma<T extends string>(
  filter: AbstractStringFilterItem<T>
): Prisma.StringFilter {
  switch (filter.comparison) {
    case StringComparator.IS:
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
    default: {
      throw new Error(
        `Unsupported string comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function booleanFilterToPrisma<T extends string>(
  filter: AbstractBooleanFilterItem<T>
): Prisma.BoolFilter {
  switch (filter.comparison) {
    case IsComparator.IS: {
      if (filter.negate) {
        return { not: { equals: filter.value } };
      }
      return { equals: filter.value };
    }
    default: {
      throw new Error(
        `Unsupported boolean comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function dateFilterToPrisma<T extends string>(
  filter: AbstractDateFilterItem<T>
): Prisma.DateTimeFilter {
  switch (filter.comparison) {
    case IsComparator.IS:
    case NumericComparator.EQUALS: {
      if (filter.negate) {
        return { not: { equals: filter.value } };
      }
      return { equals: filter.value };
    }
    case NumericComparator.GREATER_THAN: {
      if (filter.negate) {
        return { not: { gt: filter.value } };
      }
      return { gt: filter.value };
    }
    case NumericComparator.GREATER_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        return { not: { gte: filter.value } };
      }
      return { gte: filter.value };
    }
    case NumericComparator.LESS_THAN: {
      if (filter.negate) {
        return { not: { lt: filter.value } };
      }
      return { lt: filter.value };
    }
    case NumericComparator.LESS_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        return { not: { lte: filter.value } };
      }
      return { lte: filter.value };
    }
    default: {
      throw new Error(
        `Unsupported date comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function isNullFilterToPrisma<T extends string>(
  filter: AbstractIsNullFilterItem<T>
):
  | Prisma.IntNullableFilter
  | Prisma.StringNullableFilter
  | Prisma.BoolNullableFilter
  | Prisma.DateTimeNullableFilter {
  if (filter.negate) {
    return { not: { equals: null } };
  }
  return { equals: null };
}

export function numericFilterToPrisma<T extends string>(
  filter: AbstractNumericFilterItem<T>
): Prisma.IntFilter {
  switch (filter.comparison) {
    case NumericComparator.EQUALS: {
      if (filter.negate) {
        return { not: { equals: filter.value } };
      }
      return { equals: filter.value };
    }
    case NumericComparator.GREATER_THAN: {
      if (filter.negate) {
        return { not: { gt: filter.value } };
      }
      return { gt: filter.value };
    }
    case NumericComparator.GREATER_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        return { not: { gte: filter.value } };
      }
      return { gte: filter.value };
    }
    case NumericComparator.LESS_THAN: {
      if (filter.negate) {
        return { not: { lt: filter.value } };
      }
      return { lt: filter.value };
    }
    case NumericComparator.LESS_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        return { not: { lte: filter.value } };
      }
      return { lte: filter.value };
    }
    default: {
      throw new Error(
        `Unsupported numeric comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function oneOfFilterToPrisma<T extends string>(
  filter: AbstractOneOfFilterItem<T>
): { not?: { in?: never[] } } | { in?: never[] } {
  if (filter.negate) {
    return { not: { in: [...filter.value] as never[] } };
  }
  return { in: [...filter.value] as never[] };
}
