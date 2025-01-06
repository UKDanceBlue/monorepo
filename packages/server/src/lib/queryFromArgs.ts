import type { Prisma } from "@prisma/client";
import type { Args } from "@prisma/client/runtime/library";
import type {
  AbstractFilterGroup,
  AbstractFilterItem,
  AbstractSearchFilter,
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
import {
  InvalidArgumentError,
  InvariantError,
} from "@ukdanceblue/common/error";
import { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import type { RepositoryResult } from "#repositories/shared.js";

export type GetWhereFn<T> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  placeholder: any
) => RepositoryResult<Args<T, "findMany">["where"]>;
export type GetOrderFn<T> = (
  order: SortDirection
) => RepositoryResult<Args<T, "findMany">["orderBy"]>;

export interface FieldLookupItem<T> {
  getWhere: GetWhereFn<T>;
  getOrderBy: GetOrderFn<T>;
  searchable?: true;
}

export type FieldLookup<T, Field extends string> = Record<
  Field,
  FieldLookupItem<T>
>;

function buildWhereFromItem<T, Field extends string>(
  filter: AbstractFilterItem<Field>,
  fieldLookup: FieldLookup<T, Field>
): RepositoryResult<{
  where: Args<T, "findMany">["where"];
  orderObj: Args<T, "findMany">["orderBy"];
}> {
  return getPrismaFilterFor(filter).andThen((prismaFilter) =>
    fieldLookup[filter.field].getWhere(prismaFilter)
  );
}

function getPrismaFilterFor<Field extends string>(
  filter: AbstractFilterItem<Field>
): RepositoryResult<unknown> {
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
        return Ok(null);
      }
      case NoTargetOperators.IS_NOT_NULL: {
        return Ok({
          not: null,
        } satisfies Prisma.IntNullableFilter);
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
        return Ok({
          equals: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok({
          not: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.GREATER_THAN: {
        return Ok({
          gt: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO: {
        return Ok({
          gte: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.LESS_THAN: {
        return Ok({
          lt: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO: {
        return Ok({
          lte: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.CONTAINS: {
        return Ok({
          contains: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.NOT_CONTAINS: {
        return Ok({
          not: {
            contains: singleStringFilter.value,
          },
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.INSENSITIVE_CONTAINS: {
        return Ok({
          contains: singleStringFilter.value,
          mode: "insensitive",
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.INSENSITIVE_NOT_CONTAINS: {
        return Ok({
          not: {
            contains: singleStringFilter.value,
          },
          mode: "insensitive",
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.STARTS_WITH: {
        return Ok({
          startsWith: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.NOT_STARTS_WITH: {
        return Ok({
          not: {
            startsWith: singleStringFilter.value,
          },
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.INSENSITIVE_STARTS_WITH: {
        return Ok({
          startsWith: singleStringFilter.value,
          mode: "insensitive",
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.INSENSITIVE_NOT_STARTS_WITH: {
        return Ok({
          not: {
            startsWith: singleStringFilter.value,
          },
          mode: "insensitive",
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.ENDS_WITH: {
        return Ok({
          endsWith: singleStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.NOT_ENDS_WITH: {
        return Ok({
          not: {
            endsWith: singleStringFilter.value,
          },
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.INSENSITIVE_ENDS_WITH: {
        return Ok({
          endsWith: singleStringFilter.value,
          mode: "insensitive",
        } satisfies Prisma.StringFilter);
      }
      case SingleTargetOperators.INSENSITIVE_NOT_ENDS_WITH: {
        return Ok({
          not: {
            endsWith: singleStringFilter.value,
          },
          mode: "insensitive",
        } satisfies Prisma.StringFilter);
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
        return Ok({
          equals: singleNumberFilter.value,
        } satisfies Prisma.FloatFilter);
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok({
          not: singleNumberFilter.value,
        } satisfies Prisma.FloatFilter);
      }
      case SingleTargetOperators.GREATER_THAN: {
        return Ok({
          gt: singleNumberFilter.value,
        } satisfies Prisma.FloatFilter);
      }
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO: {
        return Ok({
          gte: singleNumberFilter.value,
        } satisfies Prisma.FloatFilter);
      }
      case SingleTargetOperators.LESS_THAN: {
        return Ok({
          lt: singleNumberFilter.value,
        } satisfies Prisma.FloatFilter);
      }
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO: {
        return Ok({
          lte: singleNumberFilter.value,
        } satisfies Prisma.FloatFilter);
      }
      case SingleTargetOperators.CONTAINS:
      case SingleTargetOperators.NOT_CONTAINS:
      case SingleTargetOperators.INSENSITIVE_CONTAINS:
      case SingleTargetOperators.INSENSITIVE_NOT_CONTAINS:
      case SingleTargetOperators.STARTS_WITH:
      case SingleTargetOperators.NOT_STARTS_WITH:
      case SingleTargetOperators.INSENSITIVE_STARTS_WITH:
      case SingleTargetOperators.INSENSITIVE_NOT_STARTS_WITH:
      case SingleTargetOperators.ENDS_WITH:
      case SingleTargetOperators.NOT_ENDS_WITH:
      case SingleTargetOperators.INSENSITIVE_ENDS_WITH:
      case SingleTargetOperators.INSENSITIVE_NOT_ENDS_WITH: {
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
        return Ok({
          equals: singleBooleanFilter.value,
        } satisfies Prisma.BoolFilter);
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok({
          not: singleBooleanFilter.value,
        } satisfies Prisma.BoolFilter);
      }
      case SingleTargetOperators.GREATER_THAN:
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO:
      case SingleTargetOperators.LESS_THAN:
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO:
      case SingleTargetOperators.CONTAINS:
      case SingleTargetOperators.NOT_CONTAINS:
      case SingleTargetOperators.INSENSITIVE_CONTAINS:
      case SingleTargetOperators.INSENSITIVE_NOT_CONTAINS:
      case SingleTargetOperators.STARTS_WITH:
      case SingleTargetOperators.NOT_STARTS_WITH:
      case SingleTargetOperators.INSENSITIVE_STARTS_WITH:
      case SingleTargetOperators.INSENSITIVE_NOT_STARTS_WITH:
      case SingleTargetOperators.ENDS_WITH:
      case SingleTargetOperators.NOT_ENDS_WITH:
      case SingleTargetOperators.INSENSITIVE_ENDS_WITH:
      case SingleTargetOperators.INSENSITIVE_NOT_ENDS_WITH: {
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
        return Ok({
          in: arrayStringFilter.value,
        } satisfies Prisma.StringFilter);
      }
      case ArrayOperators.NOT_IN: {
        return Ok({
          not: {
            in: arrayStringFilter.value,
          },
        } satisfies Prisma.StringFilter);
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
        return Ok({
          in: arrayNumberFilter.value,
        } satisfies Prisma.FloatFilter);
      }
      case ArrayOperators.NOT_IN: {
        return Ok({
          not: {
            in: arrayNumberFilter.value,
          },
        } satisfies Prisma.FloatFilter);
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
    return Err(new InvariantError("Array boolean filters are not supported")); // Why would you even want this?
  } else if (arrayDateFilter) {
    switch (arrayDateFilter.comparison) {
      case ArrayOperators.IN: {
        return Ok({
          in: arrayDateFilter.value.map((v) => v.toJSDate()),
        } satisfies Prisma.DateTimeFilter);
      }
      case ArrayOperators.NOT_IN: {
        return Ok({
          not: {
            in: arrayDateFilter.value.map((v) => v.toJSDate()),
          },
        } satisfies Prisma.DateTimeFilter);
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
        return Ok({
          equals: singleDateFilter.value.toJSDate(),
        } satisfies Prisma.DateTimeFilter);
      }
      case SingleTargetOperators.NOT_EQUALS: {
        return Ok({
          not: {
            equals: singleDateFilter.value.toJSDate(),
          },
        } satisfies Prisma.DateTimeFilter);
      }
      case SingleTargetOperators.GREATER_THAN: {
        return Ok({
          gt: singleDateFilter.value.toJSDate(),
        } satisfies Prisma.DateTimeFilter);
      }
      case SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO: {
        return Ok({
          gte: singleDateFilter.value.toJSDate(),
        } satisfies Prisma.DateTimeFilter);
      }
      case SingleTargetOperators.LESS_THAN: {
        return Ok({
          lt: singleDateFilter.value.toJSDate(),
        } satisfies Prisma.DateTimeFilter);
      }
      case SingleTargetOperators.LESS_THAN_OR_EQUAL_TO: {
        return Ok({
          lte: singleDateFilter.value.toJSDate(),
        } satisfies Prisma.DateTimeFilter);
      }
      case SingleTargetOperators.CONTAINS:
      case SingleTargetOperators.NOT_CONTAINS:
      case SingleTargetOperators.INSENSITIVE_CONTAINS:
      case SingleTargetOperators.INSENSITIVE_NOT_CONTAINS:
      case SingleTargetOperators.STARTS_WITH:
      case SingleTargetOperators.NOT_STARTS_WITH:
      case SingleTargetOperators.INSENSITIVE_STARTS_WITH:
      case SingleTargetOperators.INSENSITIVE_NOT_STARTS_WITH:
      case SingleTargetOperators.ENDS_WITH:
      case SingleTargetOperators.NOT_ENDS_WITH:
      case SingleTargetOperators.INSENSITIVE_ENDS_WITH:
      case SingleTargetOperators.INSENSITIVE_NOT_ENDS_WITH: {
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
        return Ok({
          gte: twoNumberFilter.lower,
          lte: twoNumberFilter.upper,
        } satisfies Prisma.FloatFilter);
      }
      case TwoTargetOperators.NOT_BETWEEN: {
        return Ok({
          not: {
            gt: twoNumberFilter.lower,
            lt: twoNumberFilter.upper,
          },
        } satisfies Prisma.FloatFilter);
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
        return Ok({
          gte: twoDateFilter.lower.toJSDate(),
          lte: twoDateFilter.upper.toJSDate(),
        } satisfies Prisma.DateTimeFilter);
      }
      case TwoTargetOperators.NOT_BETWEEN: {
        return Ok({
          not: {
            gte: twoDateFilter.lower.toJSDate(),
            lte: twoDateFilter.upper.toJSDate(),
          },
        } satisfies Prisma.DateTimeFilter);
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

export function buildWhereFromGroup<T, Field extends string>(
  group: AbstractFilterGroup<Field>,
  fieldLookup: FieldLookup<T, Field>
): RepositoryResult<Args<T, "findMany">["where"]> {
  return Result.all(
    group.filters.map((filter) => buildWhereFromItem(filter, fieldLookup))
  )
    .andThen((filters) => {
      return Result.all(
        group.children.map((child) => buildWhereFromGroup(child, fieldLookup))
      ).andThen(
        (children): Result<Args<T, "findMany">["where"], InvariantError> => {
          switch (group.operator) {
            case FilterGroupOperator.AND: {
              return Ok({ AND: [...filters, ...children] });
            }
            case FilterGroupOperator.OR: {
              return Ok({ OR: [...filters, ...children] });
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
        }
      );
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

export function buildOrder<Field extends string, T>(
  args: AbstractSortItem<Field>[],
  fieldLookup: FieldLookup<T, Field>
): RepositoryResult<Extract<Args<T, "findMany">["orderBy"], unknown[]>> {
  return Result.all(
    args.map(({ direction, field: key }) => {
      const field = fieldLookup[key];
      switch (direction) {
        case SortDirection.asc: {
          return field.getOrderBy(SortDirection.asc);
        }
        case SortDirection.desc: {
          return field.getOrderBy(SortDirection.desc);
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

export interface PaginationParams {
  offset?: number | null | undefined;
  limit?: number | null | undefined;
}

export interface FindManyParams<Field extends string> extends PaginationParams {
  filters?: AbstractFilterGroup<Field> | null | undefined;
  sortBy?: AbstractSortItem<Field>[] | null | undefined;
  search?: AbstractSearchFilter<Field> | null | undefined;
}

export function parseFindManyParams<T, Field extends string>(
  params: FindManyParams<Field>,
  fieldLookup: FieldLookup<T, Field>,
  additionalWhere: Args<T, "findMany">["where"][]
): RepositoryResult<{
  where: Args<T, "findMany">["where"] | undefined;
  orderBy: Args<T, "findMany">["orderBy"] | undefined;
  skip: number | undefined;
  take: number | undefined;
}> {
  let where;
  let order;

  if (params.search) {
    for (const field of params.search.fields ?? []) {
      if (!fieldLookup[field].searchable) {
        return Err(
          new InvalidArgumentError(`Field ${field} is not searchable`)
        );
      }
    }

    const fields =
      params.search.fields ??
      Object.entries(fieldLookup as FieldLookup<never, string>)
        .filter(([, { searchable }]) => searchable)
        .map(([field]) => field as Field);

    where = Result.all(
      fields.map((field) =>
        fieldLookup[field].getWhere({
          search: params.search!.query,
        })
      )
    ).map((fields) => ({
      OR: fields,
    }));

    order = Ok({
      _relevance: {
        fields,
        search: params.search.query,
        sort: SortDirection.desc,
      },
    });
  } else {
    where = params.filters
      ? buildWhereFromGroup(params.filters, fieldLookup)
      : undefined;
    order = params.sortBy ? buildOrder(params.sortBy, fieldLookup) : undefined;
  }

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
    where: where?.value
      ? { AND: [where.value, ...additionalWhere] }
      : { AND: additionalWhere },
    orderBy: order?.value,
    skip: params.offset ?? undefined,
    take: params.limit ?? undefined,
  });
}
