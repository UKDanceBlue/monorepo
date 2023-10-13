import type {
  Col,
  FindAndCountOptions,
  Fn,
  Literal,
  Model,
  ModelStatic,
  WhereAttributeHash,
} from "@sequelize/core";
import { Op } from "@sequelize/core";
import type {
  BooleanFilterItemInterface,
  DateFilterItemInterface,
  FilterItem as FilterItemInterface,
  IsNullFilterItemInterface,
  ListQueryType,
  NumericFilterItemInterface,
  OneOfFilterItemInterface,
  OptionalToNullable,
  Resource,
  StringFilterItemInterface,
} from "@ukdanceblue/common";
import {
  Comparator,
  DateTimeScalar,
  IsComparator,
  NumericComparator,
  SortDirection,
  StringComparator,
  TypeMismatchError,
  VoidScalar,
} from "@ukdanceblue/common";
import { DateTime } from "luxon";
import {
  ArgsType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from "type-graphql";

registerEnumType(SortDirection, { name: "SortDirection" });

registerEnumType(Comparator, { name: "Comparator" });
registerEnumType(IsComparator, { name: "IsComparator" });
registerEnumType(StringComparator, { name: "StringComparator" });
registerEnumType(NumericComparator, { name: "NumericComparator" });

export const DEFAULT_PAGE_SIZE = 10;
export const FIRST_PAGE = 1;

export function getSequelizeOpForComparator(
  comparator: Comparator,
  negated: boolean = false
): (typeof Op)[keyof typeof Op] {
  switch (comparator) {
    case Comparator.EQUALS: {
      return negated ? Op.ne : Op.eq;
    }
    case Comparator.GREATER_THAN: {
      return negated ? Op.lte : Op.gt;
    }
    case Comparator.GREATER_THAN_OR_EQUAL_TO: {
      return negated ? Op.lt : Op.gte;
    }
    case Comparator.LESS_THAN: {
      return negated ? Op.gte : Op.lt;
    }
    case Comparator.LESS_THAN_OR_EQUAL_TO: {
      return negated ? Op.gt : Op.lte;
    }
    case Comparator.SUBSTRING: {
      return negated ? Op.notSubstring : Op.substring;
    }
    case Comparator.LIKE: {
      return negated ? Op.notLike : Op.like;
    }
    case Comparator.REGEX: {
      return negated ? Op.notRegexp : Op.regexp;
    }
    case Comparator.STARTS_WITH: {
      return negated ? Op.notLike : Op.startsWith;
    }
    case Comparator.ENDS_WITH: {
      return negated ? Op.notLike : Op.endsWith;
    }
    case Comparator.IS: {
      return negated ? Op.not : Op.is;
    }
    default: {
      throw new Error(`Unknown comparator: ${String(comparator)}`);
    }
  }
}

@ArgsType()
export class UnfilteredListQueryArgs<SortByKeys extends string = never>
  implements OptionalToNullable<Partial<ListQueryType<Resource>>>
{
  @Field(() => Int, {
    nullable: true,
    description: `The number of items to return per page, defaults to ${DEFAULT_PAGE_SIZE}`,
  })
  pageSize!: number | null;

  @Field(() => Int, {
    nullable: true,
    description: `The page number to return, defaults to ${FIRST_PAGE}`,
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
  ): FindAndCountOptions<Record<SortByKeys, never>> {
    const options: FindAndCountOptions<Record<SortByKeys, never>> = {};

    if (this.pageSize != null) {
      options.limit = this.pageSize;
    }

    if (this.page != null) {
      options.offset = (this.page - FIRST_PAGE) * (this.pageSize ?? 10);
    }

    if (this.sortBy != null && sortByMap != null) {
      const sortBy = this.sortBy.map((key) => sortByMap[key]);
      const sortDirection =
        this.sortDirection?.map((v) =>
          v === SortDirection.DESCENDING ? "DESC" : "ASC"
        ) ?? this.sortBy.map(() => "ASC");

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

export abstract class AbstractFilteredListQueryArgs<
  AllKeys extends string,
  StringFilterKeys extends AllKeys,
  NumericFilterKeys extends AllKeys,
  DateFilterKeys extends AllKeys,
  BooleanFilterKeys extends AllKeys,
> extends UnfilteredListQueryArgs<AllKeys> {
  stringFilters!: AbstractStringFilterItem<StringFilterKeys>[] | null;
  numericFilters!: AbstractNumericFilterItem<NumericFilterKeys>[] | null;
  dateFilters!: AbstractDateFilterItem<DateFilterKeys>[] | null;
  booleanFilters!: AbstractBooleanFilterItem<BooleanFilterKeys>[] | null;
  isNullFilters!: AbstractIsNullFilterItem<AllKeys>[] | null;
  oneOfFilters!: AbstractOneOfFilterItem<StringFilterKeys>[] | null;
}

export function FilteredListQueryArgs<
  AllKeys extends string,
  StringFilterKeys extends AllKeys,
  NumericFilterKeys extends AllKeys,
  DateFilterKeys extends AllKeys,
  BooleanFilterKeys extends AllKeys,
>(
  resolverName: string,
  {
    all: allKeys = [],
    string: stringFilterKeys = [],
    numeric: numericFilterKeys = [],
    date: dateFilterKeys = [],
    boolean: booleanFilterKeys = [],
  }: {
    all?: AllKeys[];
    string?: StringFilterKeys[];
    numeric?: NumericFilterKeys[];
    date?: DateFilterKeys[];
    boolean?: BooleanFilterKeys[];
  }
) {
  const AllKeysEnum = Object.fromEntries(allKeys.map((key) => [key, key])) as {
    [key in AllKeys]: key;
  };
  if (allKeys.length > 0) {
    registerEnumType(AllKeysEnum, { name: `${resolverName}AllKeys` });
  }

  const StringFilterKeysEnum = Object.fromEntries(
    stringFilterKeys.map((key) => [key, key])
  ) as {
    [key in StringFilterKeys]: key;
  };
  if (stringFilterKeys.length > 0) {
    registerEnumType(StringFilterKeysEnum, {
      name: `${resolverName}StringFilterKeys`,
    });
  }

  const NumericFilterKeysEnum = Object.fromEntries(
    numericFilterKeys.map((key) => [key, key])
  ) as {
    [key in NumericFilterKeys]: key;
  };
  if (numericFilterKeys.length > 0) {
    registerEnumType(NumericFilterKeysEnum, {
      name: `${resolverName}NumericFilterKeys`,
    });
  }

  const DateFilterKeysEnum = Object.fromEntries(
    dateFilterKeys.map((key) => [key, key])
  ) as {
    [key in DateFilterKeys]: key;
  };
  if (dateFilterKeys.length > 0) {
    registerEnumType(DateFilterKeysEnum, {
      name: `${resolverName}DateFilterKeys`,
    });
  }

  const BooleanFilterKeysEnum = Object.fromEntries(
    booleanFilterKeys.map((key) => [key, key])
  ) as {
    [key in BooleanFilterKeys]: key;
  };
  if (booleanFilterKeys.length > 0) {
    registerEnumType(BooleanFilterKeysEnum, {
      name: `${resolverName}BooleanFilterKeys`,
    });
  }

  @InputType(`${resolverName}KeyedStringFilterItem`)
  class KeyedStringFilterItem extends StringFilterItem(StringFilterKeysEnum) {}
  @InputType(`${resolverName}KeyedNumericFilterItem`)
  class KeyedNumericFilterItem extends NumericFilterItem(
    NumericFilterKeysEnum
  ) {}
  @InputType(`${resolverName}KeyedDateFilterItem`)
  class KeyedDateFilterItem extends DateFilterItem(DateFilterKeysEnum) {}
  @InputType(`${resolverName}KeyedBooleanFilterItem`)
  class KeyedBooleanFilterItem extends BooleanFilterItem(
    BooleanFilterKeysEnum
  ) {}
  @InputType(`${resolverName}KeyedOneOfFilterItem`)
  class KeyedOneOfFilterItem extends OneOfFilterItem(StringFilterKeysEnum) {}
  @InputType(`${resolverName}KeyedIsNullFilterItem`)
  class KeyedIsNullFilterItem extends IsNullFilterItem(AllKeysEnum) {}

  @ArgsType()
  abstract class FilteredListQueryArgs extends AbstractFilteredListQueryArgs<
    AllKeys,
    StringFilterKeys,
    NumericFilterKeys,
    DateFilterKeys,
    BooleanFilterKeys
  > {
    @Field(
      () =>
        stringFilterKeys.length > 0 ? [KeyedStringFilterItem] : VoidScalar,
      {
        nullable: true,
        description: "The string filters to apply to the query",
      }
    )
    stringFilters!: KeyedStringFilterItem[] | null;

    @Field(
      () =>
        numericFilterKeys.length > 0 ? [KeyedNumericFilterItem] : VoidScalar,
      {
        nullable: true,
        description: "The numeric filters to apply to the query",
      }
    )
    numericFilters!: KeyedNumericFilterItem[] | null;

    @Field(
      () => (dateFilterKeys.length > 0 ? [KeyedDateFilterItem] : VoidScalar),
      {
        nullable: true,
        description: "The date filters to apply to the query",
      }
    )
    dateFilters!: KeyedDateFilterItem[] | null;

    @Field(
      () =>
        booleanFilterKeys.length > 0 ? [KeyedBooleanFilterItem] : VoidScalar,
      {
        nullable: true,
        description: "The boolean filters to apply to the query",
      }
    )
    booleanFilters!: KeyedBooleanFilterItem[] | null;

    @Field(() => (allKeys.length > 0 ? [KeyedIsNullFilterItem] : VoidScalar), {
      nullable: true,
      description: "The is-null filters to apply to the query",
    })
    isNullFilters!: KeyedIsNullFilterItem[] | null;

    @Field(
      () => (stringFilterKeys.length > 0 ? [KeyedOneOfFilterItem] : VoidScalar),
      {
        nullable: true,
        description: "The one-of filters to apply to the query",
      }
    )
    oneOfFilters!: KeyedOneOfFilterItem[] | null;

    toSequelizeFindOptions(
      sortByMap: Partial<Record<AllKeys, string>>,
      modelStatic?: ModelStatic<Model<Record<string, unknown>>>
    ): FindAndCountOptions<Record<AllKeys, never>> {
      if (!modelStatic) {
        throw new Error(
          `No model static provided to ${resolverName} FilteredListQueryArgs`
        );
      }

      const options: FindAndCountOptions<Record<AllKeys, never>> = {
        ...super.toSequelizeFindOptions(sortByMap),
        col: `${modelStatic?.name}.id`,
        distinct: true,
      };

      const whereOptions: Partial<
        WhereAttributeHash<
          Record<string, string | number | typeof DateTimeScalar | boolean>
        >
      > = {};

      for (const filter of this.stringFilters ?? []) {
        const { field, negate, value, comparison } = filter;
        const mappedField = sortByMap?.[field];
        if (!mappedField) {
          throw new Error(
            `No mapping found for string filter field ${field} on ${resolverName}`
          );
        }
        whereOptions[mappedField] = {
          [getSequelizeOpForComparator(comparison, negate)]: value,
        };
      }
      for (const filter of this.numericFilters ?? []) {
        const { field, value, comparison, negate } = filter;
        const mappedField = sortByMap?.[field];
        if (!mappedField) {
          throw new Error(
            `No mapping found for numeric filter field ${field} on ${resolverName}`
          );
        }
        whereOptions[mappedField] = {
          [getSequelizeOpForComparator(comparison, negate)]: value,
        };
      }
      for (const filter of this.dateFilters ?? []) {
        const { field, value, comparison, negate } = filter;
        const mappedField = sortByMap?.[field];
        if (!mappedField) {
          throw new Error(
            `No mapping found for numeric filter field ${field} on ${resolverName}`
          );
        }
        const jsDate = DateTime.isDateTime(value)
          ? value.toJSDate()
          : new Date(value.toString());

        if (jsDate.toString() === "Invalid Date") {
          throw new TypeMismatchError(
            "DateTime",
            `'JSON.stringify(value)'`,
            "Invalid Date"
          );
        }

        whereOptions[mappedField] = {
          [getSequelizeOpForComparator(comparison, negate)]: jsDate,
        };
      }
      for (const filter of this.booleanFilters ?? []) {
        const { field, value, comparison, negate } = filter;
        const mappedField = sortByMap?.[field];
        if (!mappedField) {
          throw new Error(
            `No mapping found for numeric filter field ${field} on ${resolverName}`
          );
        }
        whereOptions[mappedField] = {
          [getSequelizeOpForComparator(comparison, negate)]: value,
        };
      }
      for (const filter of this.isNullFilters ?? []) {
        const { field, negate } = filter;
        const mappedField = sortByMap?.[field];
        if (!mappedField) {
          throw new Error(
            `No mapping found for numeric filter field ${field} on ${resolverName}`
          );
        }
        whereOptions[mappedField] = {
          [negate ? Op.not : Op.is]: null,
        };
      }
      for (const filter of this.oneOfFilters ?? []) {
        const { field, value, negate } = filter;
        const mappedField = sortByMap?.[field];
        if (!mappedField) {
          throw new Error(
            `No mapping found for numeric filter field ${field} on ${resolverName}`
          );
        }
        whereOptions[mappedField] = {
          [negate ? Op.notIn : Op.in]: value,
        };
      }

      options.where = whereOptions;

      return options;
    }
  }

  return FilteredListQueryArgs;
}

@InputType()
export abstract class FilterItem<Field extends string, V>
  implements FilterItemInterface<Field, V>
{
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
    nullable: true,
  })
  negate?: boolean;
}

@InputType()
export abstract class AbstractStringFilterItem<Field extends string>
  extends FilterItem<Field, string>
  implements StringFilterItemInterface<Field>
{
  @Field(() => String)
  value!: string;

  @Field(() => StringComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: StringComparator;
}

export function StringFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class StringFilterItem extends AbstractStringFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return StringFilterItem;
}

@InputType()
export abstract class AbstractNumericFilterItem<Field extends string>
  extends FilterItem<Field, number>
  implements NumericFilterItemInterface<Field>
{
  @Field(() => Number)
  value!: number;

  @Field(() => NumericComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: NumericComparator;
}

export function NumericFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class NumericFilterItem extends AbstractNumericFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return NumericFilterItem;
}

@InputType()
export abstract class AbstractDateFilterItem<Field extends string>
  extends FilterItem<Field, string>
  implements DateFilterItemInterface<Field>
{
  @Field(() => DateTimeScalar)
  value!: string;

  @Field(() => NumericComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: NumericComparator;
}

export function DateFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class DateFilterItem extends AbstractDateFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return DateFilterItem;
}

@InputType()
export abstract class AbstractBooleanFilterItem<Field extends string>
  extends FilterItem<Field, boolean>
  implements BooleanFilterItemInterface<Field>
{
  @Field(() => Boolean)
  value!: boolean;

  @Field(() => IsComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: IsComparator;
}

export function BooleanFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class BooleanFilterItem extends AbstractBooleanFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return BooleanFilterItem;
}

@InputType()
export abstract class AbstractOneOfFilterItem<Field extends string>
  extends FilterItem<Field, readonly string[]>
  implements OneOfFilterItemInterface<Field>
{
  @Field(() => [String])
  value!: readonly string[];

  comparison!: never;
}

export function OneOfFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class OneOfFilterItem extends AbstractOneOfFilterItem<Field> {
    @Field(() => fieldEnum, { description: "The field to filter on" })
    field!: Field;
  }

  return OneOfFilterItem;
}

@InputType()
export abstract class AbstractIsNullFilterItem<Field extends string>
  extends FilterItem<Field, null>
  implements IsNullFilterItemInterface<Field>
{
  value!: never;
  comparison!: never;
}

export function IsNullFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class IsNullFilterItem extends AbstractIsNullFilterItem<Field> {
    @Field(() => fieldEnum, { description: "The field to filter on" })
    field!: Field;
  }

  return IsNullFilterItem;
}
