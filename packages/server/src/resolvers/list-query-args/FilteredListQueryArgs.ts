import type {
  FindAndCountOptions,
  Model,
  ModelStatic,
  WhereAttributeHash,
} from "@sequelize/core";
import { Op } from "@sequelize/core";
import {
  DateTimeScalar,
  TypeMismatchError,
  VoidScalar,
} from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { ArgsType, Field, InputType, registerEnumType } from "type-graphql";
import {
  AbstractBooleanFilterItem,
  AbstractDateFilterItem,
  AbstractIsNullFilterItem,
  AbstractNumericFilterItem,
  AbstractOneOfFilterItem,
  AbstractStringFilterItem,
  BooleanFilterItem,
  DateFilterItem,
  IsNullFilterItem,
  NumericFilterItem,
  OneOfFilterItem,
  StringFilterItem,
} from "./FilterItem.js";
import { UnfilteredListQueryArgs } from "./UnfilteredListQueryArgs.js";
import { getSequelizeOpForComparator } from "./getSequelizeOpForComparator.js";

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
