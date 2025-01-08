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

@InputType()
export class NullFilter {
  @Field(() => NoTargetOperators)
  comparison!: NoTargetOperators;

  static from(comparison: NoTargetOperators): NullFilter {
    const val = new NullFilter();
    val.comparison = comparison;
    return val;
  }
}
@InputType()
export class SingleStringFilter {
  @Field(() => String)
  value!: string;

  @Field(() => SingleTargetOperators)
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
  @Field(() => Number)
  value!: number;

  @Field(() => SingleTargetOperators)
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
  @Field(() => DateTimeScalar)
  value!: DateTime;

  @Field(() => SingleTargetOperators)
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
  @Field(() => Boolean)
  value!: boolean;

  @Field(() => SingleTargetOperators)
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
  @Field(() => Number)
  lower!: number;

  @Field(() => Number)
  upper!: number;

  @Field(() => TwoTargetOperators)
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
  @Field(() => DateTimeScalar)
  lower!: DateTime;

  @Field(() => DateTimeScalar)
  upper!: DateTime;

  @Field(() => TwoTargetOperators)
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
  @Field(() => [String])
  value!: string[];

  @Field(() => ArrayOperators)
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
  @Field(() => [Number])
  value!: number[];

  @Field(() => ArrayOperators)
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
  @Field(() => [DateTimeScalar])
  value!: DateTime[];

  @Field(() => ArrayOperators)
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
  @Field(() => [Boolean])
  value!: boolean[];

  @Field(() => ArrayOperators)
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
      arrayBooleanFilter)!;
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

  @Field(() => SomeFilter)
  filter!: SomeFilter;
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
    @Field(() => [FilterItem], { defaultValue: [] })
    filters!: AbstractFilterItem<Field>[];

    @Field(() => [FilterGroup], { defaultValue: [] })
    children!: AbstractFilterGroup<Field>[];
  }

  return FilterGroup;
}
