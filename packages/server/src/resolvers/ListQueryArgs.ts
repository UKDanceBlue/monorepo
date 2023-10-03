import {
  Col,
  FindOptions,
  Fn,
  Literal,
  Model,
  Op,
  Sequelize,
  WhereAttributeHash,
  WhereOptions,
} from "@sequelize/core";
import type {
  ListQueryType,
  OptionalToNullable,
  Resource,
} from "@ukdanceblue/common";
import {
  Comparator,
  DateTimeScalar,
  IsComparator,
  NumericComparator,
  SortDirection,
  StringComparator,
} from "@ukdanceblue/common";
import {
  ArgsType,
  Field,
  InputType,
  createUnionType,
  registerEnumType,
} from "type-graphql";

registerEnumType(SortDirection, { name: "SortDirection" });

registerEnumType(Comparator, { name: "Comparator" });
registerEnumType(IsComparator, { name: "IsComparator" });
registerEnumType(StringComparator, { name: "StringComparator" });
registerEnumType(NumericComparator, { name: "NumericComparator" });

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 0;

export function getSequelizeOpForComparator(
  comparator: Comparator,
  negated: boolean = false
): (typeof Op)[keyof typeof Op] {
  switch (comparator) {
    case Comparator.EQUALS:
      return negated ? Op.ne : Op.eq;
    case Comparator.GREATER_THAN:
      return negated ? Op.lte : Op.gt;
    case Comparator.GREATER_THAN_OR_EQUAL_TO:
      return negated ? Op.lt : Op.gte;
    case Comparator.LESS_THAN:
      return negated ? Op.gte : Op.lt;
    case Comparator.LESS_THAN_OR_EQUAL_TO:
      return negated ? Op.gt : Op.lte;
    case Comparator.SUBSTRING:
      return negated ? Op.notSubstring : Op.substring;
    case Comparator.LIKE:
      return negated ? Op.notLike : Op.like;
    case Comparator.REGEX:
      return negated ? Op.notRegexp : Op.regexp;
    case Comparator.STARTS_WITH:
      return negated ? Op.notLike : Op.startsWith;
    case Comparator.ENDS_WITH:
      return negated ? Op.notLike : Op.endsWith;
    case Comparator.IS:
      return negated ? Op.not : Op.is;
    default:
      throw new Error(`Unknown comparator: ${comparator}`);
  }
}

@ArgsType()
export class UnfilteredListQueryArgs<SortByKeys extends string = never>
  implements OptionalToNullable<Partial<ListQueryType<Resource>>>
{
  @Field(() => Number, {
    nullable: true,
    description: `The number of items to return per page, defaults to ${DEFAULT_PAGE_SIZE}`,
  })
  pageSize!: number | null;
  @Field(() => Number, {
    nullable: true,
    description: `The page number to return, defaults to ${DEFAULT_PAGE}`,
  })
  page!: number | null;

  @Field(() => [String], {
    nullable: true,
    description:
      "The fields to sort by, in order of priority. If unspecified, the sort order is undefined",
  })
  sortBy!: SortByKeys[] | null;
  @Field(() => [SortDirection], {
    nullable: true,
    description:
      "The direction to sort, if not specified will default to ascending, the order of the values in this array should match the order of the values in the sortBy array, if only one value is specified it will be used for all sortBy values, otherwise the lengths must match",
  })
  sortDirection?: SortDirection[] | null;

  toSequelizeFindOptions(
    sortByMap?: Partial<Record<SortByKeys, Fn | Col | Literal | string>>
  ): FindOptions<Record<SortByKeys, never>> {
    const options: FindOptions = {};

    if (this.pageSize != null) {
      options.limit = this.pageSize;
    }

    if (this.page != null) {
      options.offset = this.page * (this.pageSize ?? 10);
    }

    if (this.sortBy != null && sortByMap != null) {
      const sortBy = this.sortBy.map((key) => sortByMap[key]);
      const sortDirection = this.sortDirection ?? SortDirection.ASCENDING;

      options.order = sortBy
        .map((key, index) => [key, sortDirection[index]] as const)
        .filter(
          (
            pair
          ): pair is [
            Exclude<(typeof pair)[0], undefined>,
            Exclude<(typeof pair)[1], undefined>
          ] => pair[0] != null && pair[1] != null
        );
    }

    return options;
  }
}

@ArgsType()
export class FilteredListQueryArgs<
  AllKeys extends string,
  StringFilterKeys extends AllKeys,
  NumericFilterKeys extends AllKeys,
  DateFilterKeys extends AllKeys,
  BooleanFilterKeys extends AllKeys
> extends UnfilteredListQueryArgs<AllKeys> {
  @Field(() => [StringFilterItem<StringFilterKeys>], {
    nullable: true,
    description: "The string filters to apply to the query",
  })
  stringFilters!: StringFilterItem<StringFilterKeys>[] | null;

  @Field(() => [NumericFilterItem<NumericFilterKeys>], {
    nullable: true,
    description: "The numeric filters to apply to the query",
  })
  numericFilters!: NumericFilterItem<NumericFilterKeys>[] | null;

  @Field(() => [DateFilterItem<DateFilterKeys>], {
    nullable: true,
    description: "The date filters to apply to the query",
  })
  dateFilters!: DateFilterItem<DateFilterKeys>[] | null;

  @Field(() => [BooleanFilterItem<BooleanFilterKeys>], {
    nullable: true,
    description: "The boolean filters to apply to the query",
  })
  booleanFilters!: BooleanFilterItem<BooleanFilterKeys>[] | null;

  @Field(() => [IsNullFilterItem<AllKeys>], {
    nullable: true,
    description: "The is-null filters to apply to the query",
  })
  isNullFilters!: IsNullFilterItem<AllKeys>[] | null;

  @Field(() => [OneOfFilterItem<StringFilterKeys>], {
    nullable: true,
    description: "The one-of filters to apply to the query",
  })
  oneOfFilters!: OneOfFilterItem<StringFilterKeys>[] | null;

  toSequelizeFindOptions(
    sortByMap?: Partial<Record<AllKeys, Fn | Col | Literal | string>>
  ): FindOptions<Record<AllKeys, never>> {
    const options: FindOptions<Record<AllKeys, never>> =
      super.toSequelizeFindOptions(sortByMap);

    const whereOptions: WhereAttributeHash<
      Record<string, string | number | typeof DateTimeScalar | boolean>
    > = {};

    for (const filter of this.stringFilters ?? []) {
      const { field } = filter;
      whereOptions[field] = {
        [getSequelizeOpForComparator(filter.comparison, filter.negate)]:
          filter.value,
      };
    }
    for (const filter of this.numericFilters ?? []) {
      const { field } = filter;
      whereOptions[field] = {
        [getSequelizeOpForComparator(filter.comparison, filter.negate)]:
          filter.value,
      };
    }
    for (const filter of this.dateFilters ?? []) {
      const { field } = filter;
      whereOptions[field] = {
        [getSequelizeOpForComparator(filter.comparison, filter.negate)]:
          filter.value,
      };
    }
    for (const filter of this.booleanFilters ?? []) {
      const { field } = filter;
      whereOptions[field] = {
        [getSequelizeOpForComparator(filter.comparison, filter.negate)]:
          filter.value,
      };
    }
    for (const filter of this.isNullFilters ?? []) {
      const { field } = filter;
      whereOptions[field] = {
        [filter.negate ? Op.not : Op.is]: null,
      };
    }
    for (const filter of this.oneOfFilters ?? []) {
      const { field } = filter;
      whereOptions[field] = {
        [filter.negate ? Op.notIn : Op.in]: filter.value,
      };
    }

    return options;
  }
}

@InputType()
export abstract class FilterItem<Field extends string, V> {
  @Field(() => String, { description: "The field to filter on" })
  field!: Field;

  value!: V;

  comparison!: Comparator;

  /**
   * Should the comparator be negated?
   * WARNING: This will throw if used on a comparator that does not support negation.
   * @default false
   */
  @Field(() => Boolean, {
    description:
      "Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation.",
    defaultValue: false,
  })
  negate?: boolean;
}

@InputType()
export class StringFilterItem<Field extends string> extends FilterItem<
  Field,
  string | { toString: Pick<string, "toString"> }
> {
  @Field(() => String, { description: "The value to filter by" })
  value!: string | { toString: Pick<string, "toString"> };

  @Field(() => StringComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: StringComparator;
}

@InputType()
export class NumericFilterItem<Field extends string> extends FilterItem<
  Field,
  number
> {
  @Field(() => Number, { description: "The value to filter by" })
  value!: number;

  @Field(() => NumericComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: NumericComparator;
}

@InputType()
export class DateFilterItem<Field extends string> extends FilterItem<
  Field,
  typeof DateTimeScalar
> {
  @Field(() => DateTimeScalar, { description: "The value to filter by" })
  value!: typeof DateTimeScalar;

  @Field(() => NumericComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: NumericComparator;
}

@InputType()
export class BooleanFilterItem<Field extends string> extends FilterItem<
  Field,
  boolean
> {
  @Field(() => Boolean, { description: "The value to filter by" })
  value!: boolean;

  @Field(() => IsComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: IsComparator;
}

@InputType()
export class IsNullFilterItem<Field extends string> extends FilterItem<
  Field,
  null
> {
  value!: never;
  comparison!: never;
}

@InputType()
export class OneOfFilterItem<Field extends string> extends FilterItem<
  Field,
  readonly string[]
> {
  @Field(() => [String], { description: "The value to filter by" })
  value!: readonly string[];

  comparison!: never;
}

export const FilterItemUnion = createUnionType({
  name: "FilterItemUnion",
  types: () =>
    [
      StringFilterItem,
      NumericFilterItem,
      DateFilterItem,
      BooleanFilterItem,
      IsNullFilterItem,
      OneOfFilterItem,
    ] as const,
});
