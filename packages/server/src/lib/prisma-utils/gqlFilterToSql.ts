import { Prisma } from "@prisma/client";
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

export function stringFilterToSql<T extends string>(
  filter: AbstractStringFilterItem<T>
): Prisma.Sql {
  switch (filter.comparison) {
    case StringComparator.IS:
    case StringComparator.EQUALS: {
      if (filter.negate) {
        // return { not: { equals: filter.value }, mode: "insensitive" };
        return Prisma.sql`NOT ${filter.field} = ${filter.value}`;
      }
      // return { equals: filter.value };
      return Prisma.sql`${filter.field} = ${filter.value}`;
    }
    case StringComparator.STARTS_WITH: {
      if (filter.negate) {
        // return { not: { startsWith: filter.value }, mode: "insensitive" };
        return Prisma.sql`NOT ${filter.field} ILIKE ${filter.value}%`;
      }
      // return { startsWith: filter.value, mode: "insensitive" };
      return Prisma.sql`${filter.field} ILIKE ${filter.value}%`;
    }
    case StringComparator.ENDS_WITH: {
      if (filter.negate) {
        // return { not: { endsWith: filter.value }, mode: "insensitive" };
        return Prisma.sql`NOT ${filter.field} ILIKE %${filter.value}`;
      }
      // return { endsWith: filter.value, mode: "insensitive" };
      return Prisma.sql`${filter.field} ILIKE %${filter.value}`;
    }
    case StringComparator.SUBSTRING: {
      if (filter.negate) {
        // return { not: { contains: filter.value }, mode: "insensitive" };
        return Prisma.sql`NOT ${filter.field} ILIKE %${filter.value}%`;
      }
      // return { contains: filter.value, mode: "insensitive" };
      return Prisma.sql`${filter.field} ILIKE %${filter.value}%`;
    }
    default: {
      throw new Error(
        `Unsupported string comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function booleanFilterToSql<T extends string>(
  filter: AbstractBooleanFilterItem<T>
): Prisma.Sql {
  switch (filter.comparison) {
    case IsComparator.IS: {
      if (filter.negate) {
        // return { not: { equals: filter.value } };
        return Prisma.sql`NOT ${filter.field} = ${filter.value}`;
      }
      // return { equals: filter.value };
      return Prisma.sql`${filter.field} = ${filter.value}`;
    }
    default: {
      throw new Error(
        `Unsupported boolean comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function dateFilterToSql<T extends string>(
  filter: AbstractDateFilterItem<T>
): Prisma.Sql {
  switch (filter.comparison) {
    case IsComparator.IS:
    case NumericComparator.EQUALS: {
      if (filter.negate) {
        // return { not: { equals: filter.value } };
        return Prisma.sql`NOT ${filter.field} = ${filter.value}`;
      }
      // return { equals: filter.value };
      return Prisma.sql`${filter.field} = ${filter.value}`;
    }
    case NumericComparator.GREATER_THAN: {
      if (filter.negate) {
        // return { not: { gt: filter.value } };
        return Prisma.sql`NOT ${filter.field} > ${filter.value}`;
      }
      // return { gt: filter.value };
      return Prisma.sql`${filter.field} > ${filter.value}`;
    }
    case NumericComparator.GREATER_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        // return { not: { gte: filter.value } };
        return Prisma.sql`NOT ${filter.field} >= ${filter.value}`;
      }
      // return { gte: filter.value };
      return Prisma.sql`${filter.field} >= ${filter.value}`;
    }
    case NumericComparator.LESS_THAN: {
      if (filter.negate) {
        // return { not: { lt: filter.value } };
        return Prisma.sql`NOT ${filter.field} < ${filter.value}`;
      }
      // return { lt: filter.value };
      return Prisma.sql`${filter.field} < ${filter.value}`;
    }
    case NumericComparator.LESS_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        // return { not: { lte: filter.value } };
        return Prisma.sql`NOT ${filter.field} <= ${filter.value}`;
      }
      // return { lte: filter.value };
      return Prisma.sql`${filter.field} <= ${filter.value}`;
    }
    default: {
      throw new Error(
        `Unsupported date comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function isNullFilterToSql<T extends string>(
  filter: AbstractIsNullFilterItem<T>
): Prisma.Sql {
  if (filter.negate) {
    // return { not: { equals: null } };
    return Prisma.sql`NOT ${filter.field} IS NULL`;
  }
  // return { equals: null };
  return Prisma.sql`${filter.field} IS NULL`;
}

export function numericFilterToSql<T extends string>(
  filter: AbstractNumericFilterItem<T>
): Prisma.Sql {
  switch (filter.comparison) {
    case NumericComparator.EQUALS: {
      if (filter.negate) {
        // return { not: { equals: filter.value } };
        return Prisma.sql`NOT ${filter.field} = ${filter.value}`;
      }
      // return { equals: filter.value };
      return Prisma.sql`${filter.field} = ${filter.value}`;
    }
    case NumericComparator.GREATER_THAN: {
      if (filter.negate) {
        // return { not: { gt: filter.value } };
        return Prisma.sql`NOT ${filter.field} > ${filter.value}`;
      }
      // return { gt: filter.value };
      return Prisma.sql`${filter.field} > ${filter.value}`;
    }
    case NumericComparator.GREATER_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        // return { not: { gte: filter.value } };
        return Prisma.sql`NOT ${filter.field} >= ${filter.value}`;
      }
      // return { gte: filter.value };
      return Prisma.sql`${filter.field} >= ${filter.value}`;
    }
    case NumericComparator.LESS_THAN: {
      if (filter.negate) {
        // return { not: { lt: filter.value } };
        return Prisma.sql`NOT ${filter.field} < ${filter.value}`;
      }
      // return { lt: filter.value };
      return Prisma.sql`${filter.field} < ${filter.value}`;
    }
    case NumericComparator.LESS_THAN_OR_EQUAL_TO: {
      if (filter.negate) {
        // return { not: { lte: filter.value } };
        return Prisma.sql`NOT ${filter.field} <= ${filter.value}`;
      }
      // return { lte: filter.value };
      return Prisma.sql`${filter.field} <= ${filter.value}`;
    }
    default: {
      throw new Error(
        `Unsupported numeric comparator: ${String(filter.comparison)}`
      );
    }
  }
}

export function oneOfFilterToSql<T extends string>(
  filter: AbstractOneOfFilterItem<T>
): Prisma.Sql {
  if (filter.negate) {
    // return { not: { in: [...filter.value] as never[] } };
    return Prisma.sql`NOT ${filter.field} IN (${filter.value})`;
  }
  // return { in: [...filter.value] as never[] };
  return Prisma.sql`${filter.field} IN (${filter.value})`;
}
