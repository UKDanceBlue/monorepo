import type { Col, FindOptions, Fn, Literal } from "@sequelize/core";
import type {
  ListQueryType,
  OptionalToNullable,
  Resource,
} from "@ukdanceblue/common";
import {
  Comparator,
  DateTimeScalar,
  EqualityComparator,
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
registerEnumType(EqualityComparator, { name: "EqualityComparator" });
registerEnumType(StringComparator, { name: "StringComparator" });
registerEnumType(NumericComparator, { name: "NumericComparator" });

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 0;

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
  ): FindOptions {
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
            Exclude<(typeof pair)[1], undefined>,
          ] => pair[0] != null && pair[1] != null
        );
    }

    return options;
  }
}

@ArgsType()
export class FilteredListQueryArgs<
  SortByKeys extends string,
  StringFilterKeys extends string,
  NumericFilterKeys extends string,
  DateFilterKeys extends string,
  BooleanFilterKeys extends string,
> extends UnfilteredListQueryArgs<SortByKeys> {
  @Field(() => [FilterItemUnion], {
    nullable: true,
    description: "The filters to apply to the query",
  })
  filters!:
    | (
        | StringFilterItem<StringFilterKeys>
        | NumericFilterItem<NumericFilterKeys>
        | DateFilterItem<DateFilterKeys>
        | OneOfFilterItem<StringFilterKeys>
        | BooleanFilterItem<BooleanFilterKeys>
      )[]
    | null;

  toSequelizeFindOptions(
    sortByMap?: Partial<
      Record<
        | SortByKeys
        | StringFilterKeys
        | NumericFilterKeys
        | DateFilterKeys
        | BooleanFilterKeys,
        Fn | Col | Literal | string
      >
    >
  ): FindOptions<
    | SortByKeys
    | StringFilterKeys
    | NumericFilterKeys
    | DateFilterKeys
    | BooleanFilterKeys
  > {
    const options = super.toSequelizeFindOptions(sortByMap);

    if (this.filters) {
      const whereOptions: FindOptions<
        | SortByKeys
        | StringFilterKeys
        | NumericFilterKeys
        | DateFilterKeys
        | BooleanFilterKeys
      >["where"] = {};
      for (const filter of this.filters) {
        const { field } = filter;
        if (filter instanceof StringFilterItem) {
          whereOptions[field] = {};
        }
      }
      options.where = whereOptions;
    }

    return options;
  }
}

export abstract class FilterItem<Field extends string, V> {
  field!: Field;
  value!: V;
  comparison!: Comparator;
}

@InputType()
export class StringFilterItem<Field extends string> extends FilterItem<
  Field,
  string | { toString: Pick<string, "toString"> }
> {
  @Field(() => String, { description: "The field to filter on" })
  field!: Field;

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
  @Field(() => String, { description: "The field to filter on" })
  field!: Field;

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
  @Field(() => String, { description: "The field to filter on" })
  field!: Field;

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
  @Field(() => String, { description: "The field to filter on" })
  field!: Field;

  @Field(() => Boolean, { description: "The value to filter by" })
  value!: boolean;

  @Field(() => EqualityComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: EqualityComparator;
}

@InputType()
export class OneOfFilterItem<Field extends string> extends FilterItem<
  Field,
  readonly string[]
> {
  @Field(() => String, { description: "The field to filter on" })
  field!: Field;

  @Field(() => [String], { description: "The value to filter by" })
  value!: readonly string[];
}

export const FilterItemUnion = createUnionType({
  name: "FilterItemUnion",
  types: () =>
    [
      StringFilterItem,
      NumericFilterItem,
      DateFilterItem,
      BooleanFilterItem,
      OneOfFilterItem,
    ] as const,
});
