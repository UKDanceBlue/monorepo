import {} from "graphql-scalars";
import { DateTime } from "luxon";
import { Directive, Field, InputType, registerEnumType } from "type-graphql";

import { DateTimeScalar } from "../scalars/DateTimeISO.js";

export const NoTargetOperators = {
  IS_NULL: "IS_NULL",
  IS_NOT_NULL: "IS_NOT_NULL",
} as const;
export type NoTargetOperators =
  (typeof NoTargetOperators)[keyof typeof NoTargetOperators];
registerEnumType(NoTargetOperators, { name: "NoTargetOperators" });

export const SingleTargetOperators = {
  EQUALS: "EQUALS",
  NOT_EQUALS: "NOT_EQUALS",
  GREATER_THAN: "GREATER_THAN",
  GREATER_THAN_OR_EQUAL_TO: "GREATER_THAN_OR_EQUAL_TO",
  LESS_THAN: "LESS_THAN",
  LESS_THAN_OR_EQUAL_TO: "LESS_THAN_OR_EQUAL_TO",
  LIKE: "LIKE",
  NOT_LIKE: "NOT_LIKE",
  ILIKE: "ILIKE",
  NOT_ILIKE: "NOT_ILIKE",
} as const;
export type SingleTargetOperators =
  (typeof SingleTargetOperators)[keyof typeof SingleTargetOperators];
registerEnumType(SingleTargetOperators, { name: "SingleTargetOperators" });

export const TwoTargetOperators = {
  BETWEEN: "BETWEEN",
  NOT_BETWEEN: "NOT_BETWEEN",
} as const;
export type TwoTargetOperators =
  (typeof TwoTargetOperators)[keyof typeof TwoTargetOperators];
registerEnumType(TwoTargetOperators, { name: "TwoTargetOperators" });

export const ArrayOperators = {
  IN: "IN",
  NOT_IN: "NOT_IN",
} as const;
export type ArrayOperators =
  (typeof ArrayOperators)[keyof typeof ArrayOperators];
registerEnumType(ArrayOperators, { name: "ArrayOperators" });

@InputType()
export class NullFilter {
  @Field(() => NoTargetOperators)
  comparison!: NoTargetOperators;
}
@InputType()
export class SingleStringFilter {
  @Field(() => String)
  value!: string;

  @Field(() => SingleTargetOperators)
  comparison!: SingleTargetOperators;
}
@InputType()
export class SingleNumberFilter {
  @Field(() => Number)
  value!: number;

  @Field(() => SingleTargetOperators)
  comparison!: SingleTargetOperators;
}

@InputType()
export class SingleDateFilter {
  @Field(() => DateTimeScalar)
  value!: DateTime;

  @Field(() => SingleTargetOperators)
  comparison!: SingleTargetOperators;
}

@InputType()
export class SingleBooleanFilter {
  @Field(() => Boolean)
  value!: boolean;

  @Field(() => SingleTargetOperators)
  comparison!: SingleTargetOperators;
}

@InputType()
export class TwoNumberFilter {
  @Field(() => Number)
  lower!: number;

  @Field(() => Number)
  upper!: number;

  @Field(() => TwoTargetOperators)
  comparison!: TwoTargetOperators;
}

@InputType()
export class TwoDateFilter {
  @Field(() => DateTimeScalar)
  lower!: DateTime;

  @Field(() => DateTimeScalar)
  upper!: DateTime;

  @Field(() => TwoTargetOperators)
  comparison!: TwoTargetOperators;
}

@InputType()
export class ArrayStringFilter {
  @Field(() => [String])
  value!: string[];

  @Field(() => ArrayOperators)
  comparison!: ArrayOperators;
}

@InputType()
export class ArrayNumberFilter {
  @Field(() => [Number])
  value!: number[];

  @Field(() => ArrayOperators)
  comparison!: ArrayOperators;
}

@InputType()
export class ArrayDateFilter {
  @Field(() => [DateTimeScalar])
  value!: DateTime[];

  @Field(() => ArrayOperators)
  comparison!: ArrayOperators;
}

@InputType()
export class ArrayBooleanFilter {
  @Field(() => [Boolean])
  value!: boolean[];

  @Field(() => ArrayOperators)
  comparison!: ArrayOperators;
}

export type SomeFilterType =
  | NullFilter
  | SingleStringFilter
  | SingleNumberFilter
  | SingleDateFilter
  | SingleBooleanFilter
  | TwoNumberFilter
  | TwoDateFilter
  | ArrayStringFilter
  | ArrayNumberFilter
  | ArrayDateFilter
  | ArrayBooleanFilter;

@Directive("@oneof")
@InputType()
export class SomeFilter {
  @Field(() => NullFilter, { nullable: true })
  nullFilter?: NullFilter;
  @Field(() => SingleStringFilter, { nullable: true })
  singleStringFilter?: SingleStringFilter;
  @Field(() => SingleNumberFilter, { nullable: true })
  singleNumberFilter?: SingleNumberFilter;
  @Field(() => SingleDateFilter, { nullable: true })
  singleDateFilter?: SingleDateFilter;
  @Field(() => SingleBooleanFilter, { nullable: true })
  singleBooleanFilter?: SingleBooleanFilter;
  @Field(() => TwoNumberFilter, { nullable: true })
  twoNumberFilter?: TwoNumberFilter;
  @Field(() => TwoDateFilter, { nullable: true })
  twoDateFilter?: TwoDateFilter;
  @Field(() => ArrayStringFilter, { nullable: true })
  arrayStringFilter?: ArrayStringFilter;
  @Field(() => ArrayNumberFilter, { nullable: true })
  arrayNumberFilter?: ArrayNumberFilter;
  @Field(() => ArrayDateFilter, { nullable: true })
  arrayDateFilter?: ArrayDateFilter;
  @Field(() => ArrayBooleanFilter, { nullable: true })
  arrayBooleanFilter?: ArrayBooleanFilter;

  get filter(): SomeFilterType {
    const {
      nullFilter,
      singleStringFilter,
      singleNumberFilter,
      singleDateFilter,
      singleBooleanFilter,
      twoNumberFilter,
      twoDateFilter,
      arrayStringFilter,
      arrayNumberFilter,
      arrayDateFilter,
      arrayBooleanFilter,
    } = this as Partial<typeof this>;

    return (nullFilter ??
      singleStringFilter ??
      singleNumberFilter ??
      singleDateFilter ??
      singleBooleanFilter ??
      twoNumberFilter ??
      twoDateFilter ??
      arrayStringFilter ??
      arrayNumberFilter ??
      arrayDateFilter ??
      arrayBooleanFilter)!;
  }
}

export const FilterGroupOperator = {
  AND: "AND",
  OR: "OR",
} as const;
export type FilterGroupOperator =
  (typeof FilterGroupOperator)[keyof typeof FilterGroupOperator];
registerEnumType(FilterGroupOperator, { name: "FilterGroupOperator" });

@InputType()
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export abstract class AbstractFilterItem<Field extends string> {
  field!: Field;

  @Field(() => SomeFilter)
  filter!: SomeFilter;

  @Field(() => Boolean)
  negate!: boolean;
}

export function createFilterItem<Field extends string>(
  fieldEnum: Record<Field, Field>,
  resolverName: string
) {
  @InputType(`${resolverName}FilterItem`)
  class FilterItem extends AbstractFilterItem<Field> {
    @Field(() => fieldEnum)
    field!: Field;
  }

  return FilterItem;
}

@InputType()
export abstract class AbstractFilterGroup<Field extends string> {
  filters!: AbstractFilterItem<Field>[];

  children!: AbstractFilterGroup<Field>[];

  @Field(() => FilterGroupOperator)
  operator!: FilterGroupOperator;
}

export function createFilterGroup<Field extends string>(
  fieldEnum: Record<string, Field>,
  resolverName: string
) {
  const FilterItem = createFilterItem(fieldEnum, resolverName);

  @InputType(`${resolverName}FilterGroup`)
  class FilterGroup extends AbstractFilterGroup<Field> {
    @Field(() => [FilterItem])
    filters!: AbstractFilterItem<Field>[];

    @Field(() => [FilterGroup])
    children!: AbstractFilterGroup<Field>[];
  }

  return FilterGroup;
}
