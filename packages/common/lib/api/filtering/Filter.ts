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
  CONTAINS: "CONTAINS",
  NOT_CONTAINS: "NOT_CONTAINS",
  INSENSITIVE_CONTAINS: "INSENSITIVE_CONTAINS",
  INSENSITIVE_NOT_CONTAINS: "INSENSITIVE_NOT_CONTAINS",
  STARTS_WITH: "STARTS_WITH",
  NOT_STARTS_WITH: "NOT_STARTS_WITH",
  INSENSITIVE_STARTS_WITH: "INSENSITIVE_STARTS_WITH",
  INSENSITIVE_NOT_STARTS_WITH: "INSENSITIVE_NOT_STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  NOT_ENDS_WITH: "NOT_ENDS_WITH",
  INSENSITIVE_ENDS_WITH: "INSENSITIVE_ENDS_WITH",
  INSENSITIVE_NOT_ENDS_WITH: "INSENSITIVE_NOT_ENDS_WITH",
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

export const ArrayArrayOperators = {
  EQUALS: "EQUALS",
  HAS: "HAS",
  HAS_EVERY: "HAS_EVERY",
  HAS_SOME: "HAS_SOME",
  IS_EMPTY: "IS_EMPTY",
} as const;
export type ArrayArrayOperators =
  (typeof ArrayArrayOperators)[keyof typeof ArrayArrayOperators];
registerEnumType(ArrayArrayOperators, { name: "ArrayArrayOperators" });

@InputType()
export class NullFilter {
  @Field(() => NoTargetOperators, { nullable: false })
  comparison!: NoTargetOperators;

  static from(comparison: NoTargetOperators): NullFilter {
    const val = new NullFilter();
    val.comparison = comparison;
    return val;
  }
}
@InputType()
export class SingleStringFilter {
  @Field(() => String, { nullable: false })
  value!: string;

  @Field(() => SingleTargetOperators, { nullable: false })
  comparison!: SingleTargetOperators;

  static from(
    value: string,
    comparison: SingleTargetOperators
  ): SingleStringFilter {
    const val = new SingleStringFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}
@InputType()
export class SingleNumberFilter {
  @Field(() => Number, { nullable: false })
  value!: number;

  @Field(() => SingleTargetOperators, { nullable: false })
  comparison!: SingleTargetOperators;

  static from(
    value: number,
    comparison: SingleTargetOperators
  ): SingleNumberFilter {
    const val = new SingleNumberFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class SingleDateFilter {
  @Field(() => DateTimeScalar, { nullable: false })
  value!: DateTime;

  @Field(() => SingleTargetOperators, { nullable: false })
  comparison!: SingleTargetOperators;

  static from(
    value: DateTime,
    comparison: SingleTargetOperators
  ): SingleDateFilter {
    const val = new SingleDateFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class SingleBooleanFilter {
  @Field(() => Boolean, { nullable: false })
  value!: boolean;

  @Field(() => SingleTargetOperators, { nullable: false })
  comparison!: SingleTargetOperators;

  static from(
    value: boolean,
    comparison: SingleTargetOperators
  ): SingleBooleanFilter {
    const val = new SingleBooleanFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class TwoNumberFilter {
  @Field(() => Number, { nullable: false })
  lower!: number;

  @Field(() => Number, { nullable: false })
  upper!: number;

  @Field(() => TwoTargetOperators, { nullable: false })
  comparison!: TwoTargetOperators;

  static from(
    lower: number,
    upper: number,
    comparison: TwoTargetOperators
  ): TwoNumberFilter {
    const val = new TwoNumberFilter();
    val.lower = lower;
    val.upper = upper;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class TwoDateFilter {
  @Field(() => DateTimeScalar, { nullable: false })
  lower!: DateTime;

  @Field(() => DateTimeScalar, { nullable: false })
  upper!: DateTime;

  @Field(() => TwoTargetOperators, { nullable: false })
  comparison!: TwoTargetOperators;

  static from(
    lower: DateTime,
    upper: DateTime,
    comparison: TwoTargetOperators
  ): TwoDateFilter {
    const val = new TwoDateFilter();
    val.lower = lower;
    val.upper = upper;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class ArrayStringFilter {
  @Field(() => [String], { nullable: false })
  value!: string[];

  @Field(() => ArrayOperators, { nullable: false })
  comparison!: ArrayOperators;

  static from(value: string[], comparison: ArrayOperators): ArrayStringFilter {
    const val = new ArrayStringFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class ArrayNumberFilter {
  @Field(() => [Number], { nullable: false })
  value!: number[];

  @Field(() => ArrayOperators, { nullable: false })
  comparison!: ArrayOperators;

  static from(value: number[], comparison: ArrayOperators): ArrayNumberFilter {
    const val = new ArrayNumberFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class ArrayDateFilter {
  @Field(() => [DateTimeScalar], { nullable: false })
  value!: DateTime[];

  @Field(() => ArrayOperators, { nullable: false })
  comparison!: ArrayOperators;

  static from(value: DateTime[], comparison: ArrayOperators): ArrayDateFilter {
    const val = new ArrayDateFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class ArrayBooleanFilter {
  @Field(() => [Boolean], { nullable: false })
  value!: boolean[];

  @Field(() => ArrayOperators, { nullable: false })
  comparison!: ArrayOperators;

  static from(
    value: boolean[],
    comparison: ArrayOperators
  ): ArrayBooleanFilter {
    const val = new ArrayBooleanFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
}

@InputType()
export class ArrayArrayFilter {
  @Field(() => [String], { nullable: false })
  value: string[] = [];

  @Field(() => ArrayArrayOperators, { nullable: false })
  comparison!: ArrayArrayOperators;

  static from(
    value: string[],
    comparison: ArrayArrayOperators
  ): ArrayArrayFilter {
    if (comparison === ArrayArrayOperators.IS_EMPTY && value.length > 0) {
      throw new TypeError("Value must be empty for IS_EMPTY comparison");
    }
    if (comparison !== ArrayArrayOperators.HAS && value.length !== 1) {
      throw new TypeError(
        "Value must contain exactly one element for HAS comparison"
      );
    }
    const val = new ArrayArrayFilter();
    val.value = value;
    val.comparison = comparison;
    return val;
  }
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
  | ArrayBooleanFilter
  | ArrayArrayFilter;

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
  @Field(() => ArrayArrayFilter, { nullable: true })
  arrayArrayFilter?: ArrayArrayFilter;

  static getFilter(some: SomeFilter): SomeFilterType {
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
      arrayArrayFilter,
    } = some;

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
      arrayBooleanFilter ??
      arrayArrayFilter)!;
  }

  static from(filter: SomeFilterType): SomeFilter {
    const val = new SomeFilter();

    if (filter instanceof NullFilter) {
      val.nullFilter = filter;
    } else if (filter instanceof SingleStringFilter) {
      val.singleStringFilter = filter;
    } else if (filter instanceof SingleNumberFilter) {
      val.singleNumberFilter = filter;
    } else if (filter instanceof SingleDateFilter) {
      val.singleDateFilter = filter;
    } else if (filter instanceof SingleBooleanFilter) {
      val.singleBooleanFilter = filter;
    } else if (filter instanceof TwoNumberFilter) {
      val.twoNumberFilter = filter;
    } else if (filter instanceof TwoDateFilter) {
      val.twoDateFilter = filter;
    } else if (filter instanceof ArrayStringFilter) {
      val.arrayStringFilter = filter;
    } else if (filter instanceof ArrayNumberFilter) {
      val.arrayNumberFilter = filter;
    } else if (filter instanceof ArrayDateFilter) {
      val.arrayDateFilter = filter;
    } else if (filter instanceof ArrayBooleanFilter) {
      val.arrayBooleanFilter = filter;
    } else if (filter instanceof ArrayArrayFilter) {
      val.arrayArrayFilter = filter;
    } else {
      throw new TypeError("Invalid filter type");
    }

    return val;
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

  @Field(() => SomeFilter, { nullable: false })
  filter!: SomeFilter;
}

export function createFilterItem<Field extends string>(
  fieldEnum: Record<Field, Field>,
  resolverName: string
) {
  @InputType(`${resolverName}FilterItem`)
  class FilterItem extends AbstractFilterItem<Field> {
    @Field(() => fieldEnum, { nullable: false })
    declare field: Field;
  }

  return FilterItem;
}

@InputType()
export abstract class AbstractFilterGroup<Field extends string> {
  declare filters: AbstractFilterItem<Field>[];
  declare children: AbstractFilterGroup<Field>[];

  @Field(() => FilterGroupOperator, { nullable: false })
  declare operator: FilterGroupOperator;
}

export function createFilterGroup<Field extends string>(
  fieldEnum: Record<string, Field>,
  resolverName: string
) {
  const FilterItem = createFilterItem(fieldEnum, resolverName);

  @InputType(`${resolverName}FilterGroup`)
  class FilterGroup extends AbstractFilterGroup<Field> {
    @Field(() => [FilterItem], { nullable: false })
    filters: AbstractFilterItem<Field>[] = [];

    @Field(() => [FilterGroup], { nullable: false })
    children: AbstractFilterGroup<Field>[] = [];
  }

  return FilterGroup;
}
