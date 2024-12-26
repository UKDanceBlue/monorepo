import type {
  AbstractFilterGroup,
  AbstractFilterItem,
  AbstractSortItem,
} from "@ukdanceblue/common";
import { SortDirection } from "@ukdanceblue/common";
import {
  ArrayOperators,
  FilterGroupOperator,
  NoTargetOperators,
  SingleTargetOperators,
  TwoTargetOperators,
} from "@ukdanceblue/common";
import { InvariantError } from "@ukdanceblue/common/error";
import type { SQL } from "drizzle-orm";
import {
  and,
  asc,
  between,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  not,
  notBetween,
  notIlike,
  notInArray,
  notLike,
  or,
} from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

function buildWhereFromItemWithoutNegate<Field extends string>(
  filter: AbstractFilterItem<Field>,
  fieldLookup: Record<Field, SQL.Aliased | AnyPgColumn>
): Result<SQL, InvariantError> {
  const field = fieldLookup[filter.field];

  const {
    arrayBooleanFilter,
    arrayDateFilter,
    arrayNumberFilter,
    arrayStringFilter,
    nullFilter,
    singleBooleanFilter,
    singleDateFilter,
    singleNumberFilter,
    singleStringFilter,
    twoDateFilter,
    twoNumberFilter,
  } = filter.filter;

  if (nullFilter) {
    switch (nullFilter.comparison) {
      case NoTargetOperators.IS_NULL: {
        return Ok(isNull(field));
      }
      case NoTargetOperators.IS_NOT_NULL: {
        return Ok(isNotNull(field));
      }
      default: {
        nullFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported null filter comparison: ${String(nullFilter.comparison)}`
          )
        );
      }
    }
  } else if (singleStringFilter) {
    switch (singleStringFilter.comparison) {
      case SingleTargetOperators.EQUALS: {
        return Ok(eq(field as AnyPgColumn, singleStringFilter.value));
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok(ne(field as AnyPgColumn, singleStringFilter.value));
      }
      case SingleTargetOperators.GREATER_THAN: {
        return Ok(gt(field as AnyPgColumn, singleStringFilter.value));
      }
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO: {
        return Ok(gte(field as AnyPgColumn, singleStringFilter.value));
      }
      case SingleTargetOperators.LESS_THAN: {
        return Ok(lt(field as AnyPgColumn, singleStringFilter.value));
      }
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO: {
        return Ok(lte(field as AnyPgColumn, singleStringFilter.value));
      }
      case SingleTargetOperators.LIKE: {
        return Ok(like(field, singleStringFilter.value));
      }
      case SingleTargetOperators.NOT_LIKE: {
        return Ok(notLike(field, singleStringFilter.value));
      }
      case SingleTargetOperators.ILIKE: {
        return Ok(ilike(field, singleStringFilter.value));
      }
      case SingleTargetOperators.NOT_ILIKE: {
        return Ok(notIlike(field, singleStringFilter.value));
      }
      default: {
        singleStringFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported single string filter comparison: ${String(singleStringFilter.comparison)}`
          )
        );
      }
    }
  } else if (singleNumberFilter) {
    switch (singleNumberFilter.comparison) {
      case SingleTargetOperators.EQUALS: {
        return Ok(eq(field as AnyPgColumn, singleNumberFilter.value));
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok(ne(field as AnyPgColumn, singleNumberFilter.value));
      }
      case SingleTargetOperators.GREATER_THAN: {
        return Ok(gt(field as AnyPgColumn, singleNumberFilter.value));
      }
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO: {
        return Ok(gte(field as AnyPgColumn, singleNumberFilter.value));
      }
      case SingleTargetOperators.LESS_THAN: {
        return Ok(lt(field as AnyPgColumn, singleNumberFilter.value));
      }
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO: {
        return Ok(lte(field as AnyPgColumn, singleNumberFilter.value));
      }
      case SingleTargetOperators.LIKE:
      case SingleTargetOperators.NOT_LIKE:
      case SingleTargetOperators.ILIKE:
      case SingleTargetOperators.NOT_ILIKE: {
        return Err(
          new InvariantError(
            `Unsupported single number filter comparison: ${String(singleNumberFilter.comparison)}`
          )
        );
      }
      default: {
        singleNumberFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported single number filter comparison: ${String(singleNumberFilter.comparison)}`
          )
        );
      }
    }
  } else if (singleBooleanFilter) {
    switch (singleBooleanFilter.comparison) {
      case SingleTargetOperators.EQUALS: {
        return Ok(eq(field as AnyPgColumn, singleBooleanFilter.value));
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok(ne(field as AnyPgColumn, singleBooleanFilter.value));
      }
      case SingleTargetOperators.GREATER_THAN:
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO:
      case SingleTargetOperators.LESS_THAN:
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO:
      case SingleTargetOperators.LIKE:
      case SingleTargetOperators.NOT_LIKE:
      case SingleTargetOperators.ILIKE:
      case SingleTargetOperators.NOT_ILIKE: {
        return Err(
          new InvariantError(
            `Unsupported single boolean filter comparison: ${String(singleBooleanFilter.comparison)}`
          )
        );
      }
      default: {
        singleBooleanFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported single boolean filter comparison: ${String(singleBooleanFilter.comparison)}`
          )
        );
      }
    }
  } else if (arrayStringFilter) {
    switch (arrayStringFilter.comparison) {
      case ArrayOperators.IN: {
        return Ok(inArray(field as AnyPgColumn, arrayStringFilter.value));
      }
      case ArrayOperators.NOT_IN: {
        return Ok(notInArray(field as AnyPgColumn, arrayStringFilter.value));
      }
      default: {
        arrayStringFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported array string filter comparison: ${String(arrayStringFilter.comparison)}`
          )
        );
      }
    }
  } else if (arrayNumberFilter) {
    switch (arrayNumberFilter.comparison) {
      case ArrayOperators.IN: {
        return Ok(inArray(field as AnyPgColumn, arrayNumberFilter.value));
      }
      case ArrayOperators.NOT_IN: {
        return Ok(notInArray(field as AnyPgColumn, arrayNumberFilter.value));
      }
      default: {
        arrayNumberFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported array number filter comparison: ${String(arrayNumberFilter.comparison)}`
          )
        );
      }
    }
  } else if (arrayBooleanFilter) {
    switch (arrayBooleanFilter.comparison) {
      case ArrayOperators.IN: {
        return Ok(inArray(field as AnyPgColumn, arrayBooleanFilter.value));
      }
      case ArrayOperators.NOT_IN: {
        return Ok(notInArray(field as AnyPgColumn, arrayBooleanFilter.value));
      }
      default: {
        arrayBooleanFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported array boolean filter comparison: ${String(arrayBooleanFilter.comparison)}`
          )
        );
      }
    }
  } else if (arrayDateFilter) {
    switch (arrayDateFilter.comparison) {
      case ArrayOperators.IN: {
        return Ok(inArray(field as AnyPgColumn, arrayDateFilter.value));
      }
      case ArrayOperators.NOT_IN: {
        return Ok(notInArray(field as AnyPgColumn, arrayDateFilter.value));
      }
      default: {
        arrayDateFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported array date filter comparison: ${String(arrayDateFilter.comparison)}`
          )
        );
      }
    }
  } else if (singleDateFilter) {
    switch (singleDateFilter.comparison) {
      case SingleTargetOperators.EQUALS: {
        return Ok(eq(field as AnyPgColumn, singleDateFilter.value));
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok(ne(field as AnyPgColumn, singleDateFilter.value));
      }
      case SingleTargetOperators.GREATER_THAN: {
        return Ok(gt(field as AnyPgColumn, singleDateFilter.value));
      }
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO: {
        return Ok(gte(field as AnyPgColumn, singleDateFilter.value));
      }
      case SingleTargetOperators.LESS_THAN: {
        return Ok(lt(field as AnyPgColumn, singleDateFilter.value));
      }
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO: {
        return Ok(lte(field as AnyPgColumn, singleDateFilter.value));
      }
      case SingleTargetOperators.LIKE:
      case SingleTargetOperators.NOT_LIKE:
      case SingleTargetOperators.ILIKE:
      case SingleTargetOperators.NOT_ILIKE: {
        return Err(
          new InvariantError(
            `Unsupported single date filter comparison: ${String(singleDateFilter.comparison)}`
          )
        );
      }
      default: {
        singleDateFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported single date filter comparison: ${String(singleDateFilter.comparison)}`
          )
        );
      }
    }
  } else if (twoNumberFilter) {
    switch (twoNumberFilter.comparison) {
      case TwoTargetOperators.BETWEEN: {
        return Ok(
          between(
            field as AnyPgColumn,
            twoNumberFilter.lower,
            twoNumberFilter.upper
          )
        );
      }
      case TwoTargetOperators.NOT_BETWEEN: {
        return Ok(
          notBetween(
            field as AnyPgColumn,
            twoNumberFilter.lower,
            twoNumberFilter.upper
          )
        );
      }
      default: {
        twoNumberFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported two number filter comparison: ${String(twoNumberFilter.comparison)}`
          )
        );
      }
    }
  } else if (twoDateFilter) {
    switch (twoDateFilter.comparison) {
      case TwoTargetOperators.BETWEEN: {
        return Ok(
          between(
            field as AnyPgColumn,
            twoDateFilter.lower,
            twoDateFilter.upper
          )
        );
      }
      case TwoTargetOperators.NOT_BETWEEN: {
        return Ok(
          notBetween(
            field as AnyPgColumn,
            twoDateFilter.lower,
            twoDateFilter.upper
          )
        );
      }
      default: {
        twoDateFilter.comparison satisfies never;
        return Err(
          new InvariantError(
            `Unsupported two date filter comparison: ${String(twoDateFilter.comparison)}`
          )
        );
      }
    }
  } else {
    return Err(new InvariantError("Filter item has no filter"));
  }
}

export function buildWhereFromGroup<Field extends string>(
  group: AbstractFilterGroup<Field>,
  fieldLookup: Record<Field, SQL.Aliased | AnyPgColumn>
): Result<SQL, InvariantError> {
  return Result.all(
    group.filters.map((filter) =>
      buildWhereFromItemWithoutNegate(filter, fieldLookup).map(not)
    )
  )
    .andThen((filters) => {
      return Result.all(
        group.children.map((child) => buildWhereFromGroup(child, fieldLookup))
      ).andThen((children) => {
        switch (group.operator) {
          case FilterGroupOperator.AND: {
            return Ok(and(...filters, ...children));
          }
          case FilterGroupOperator.OR: {
            return Ok(or(...filters, ...children));
          }
          default: {
            group.operator satisfies never;
            return Err(
              new InvariantError(
                `Unsupported filter group operator: ${String(group.operator)}`
              )
            );
          }
        }
      });
    })
    .andThen((where) => {
      if (!where) {
        return Err(
          new InvariantError("Filter group produced no valid where clause")
        );
      }
      return Ok(where);
    });
}

export function buildOrder<Field extends string>(
  args: AbstractSortItem<Field>[],
  fieldLookup: Record<Field, SQL.Aliased | AnyPgColumn>
): Result<SQL[], InvariantError> {
  return Result.all(
    args.map(({ direction, field: key }) => {
      const field = fieldLookup[key];
      switch (direction) {
        case SortDirection.asc: {
          return Ok(asc(field));
        }
        case SortDirection.desc: {
          return Ok(desc(field));
        }
        default: {
          direction satisfies never;
          return Err(
            new InvariantError(
              `Unsupported sort direction: ${String(direction)}`
            )
          );
        }
      }
    })
  );
}

export interface FindManyParams<Field extends string> {
  filters?: AbstractFilterGroup<Field> | null | undefined;
  sortBy?: AbstractSortItem<Field>[] | null | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
}

export function parseFindManyParams<Field extends string>(
  params: FindManyParams<Field>,
  fieldLookup: Record<Field, SQL.Aliased | AnyPgColumn>
): Result<
  {
    where: SQL | undefined;
    orderBy: SQL[] | undefined;
    offset: number | undefined;
    limit: number | undefined;
  },
  InvariantError
> {
  const where = params.filters
    ? buildWhereFromGroup(params.filters, fieldLookup)
    : undefined;
  const order = params.sortBy
    ? buildOrder(params.sortBy, fieldLookup)
    : undefined;

  // Disable optional chaining for better type inference

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (where && where.isErr()) {
    return where;
  }
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (order && order.isErr()) {
    return order;
  }

  return Ok({
    where: where?.value,
    orderBy: order?.value,
    offset: params.offset ?? undefined,
    limit: params.limit ?? undefined,
  });
}
