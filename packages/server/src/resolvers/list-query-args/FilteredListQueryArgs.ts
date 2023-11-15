import type {
  Attributes,
  FindAndCountOptions,
  Model,
  ModelStatic,
  OrderItemColumn,
  WhereAttributeHash,
} from "@sequelize/core";
import { VoidResolver } from "graphql-scalars";
import { ArgsType, Field, InputType } from "type-graphql";

import type {
  AbstractBooleanFilterItem,
  AbstractDateFilterItem,
  AbstractIsNullFilterItem,
  AbstractNumericFilterItem,
  AbstractOneOfFilterItem,
  AbstractStringFilterItem,
} from "./FilterItem.js";
import {
  BooleanFilterItem,
  DateFilterItem,
  IsNullFilterItem,
  NumericFilterItem,
  OneOfFilterItem,
  StringFilterItem,
} from "./FilterItem.js";
import { UnfilteredListQueryArgs } from "./UnfilteredListQueryArgs.js";
import { filterToWhereOptions } from "./filterToWhereOptions.js";
import { registerFilterKeyEnums } from "./registerFilterKeyEnums.js";

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
  const {
    StringFilterKeysEnum,
    NumericFilterKeysEnum,
    DateFilterKeysEnum,
    BooleanFilterKeysEnum,
    AllKeysEnum,
  } = registerFilterKeyEnums<
    AllKeys,
    StringFilterKeys,
    NumericFilterKeys,
    DateFilterKeys,
    BooleanFilterKeys
  >(
    allKeys,
    resolverName,
    stringFilterKeys,
    numericFilterKeys,
    dateFilterKeys,
    booleanFilterKeys
  );

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
        stringFilterKeys.length > 0 ? [KeyedStringFilterItem] : VoidResolver,
      {
        nullable: true,
        description: "The string filters to apply to the query",
      }
    )
    stringFilters!: KeyedStringFilterItem[] | null;

    @Field(
      () =>
        numericFilterKeys.length > 0 ? [KeyedNumericFilterItem] : VoidResolver,
      {
        nullable: true,
        description: "The numeric filters to apply to the query",
      }
    )
    numericFilters!: KeyedNumericFilterItem[] | null;

    @Field(
      () => (dateFilterKeys.length > 0 ? [KeyedDateFilterItem] : VoidResolver),
      {
        nullable: true,
        description: "The date filters to apply to the query",
      }
    )
    dateFilters!: KeyedDateFilterItem[] | null;

    @Field(
      () =>
        booleanFilterKeys.length > 0 ? [KeyedBooleanFilterItem] : VoidResolver,
      {
        nullable: true,
        description: "The boolean filters to apply to the query",
      }
    )
    booleanFilters!: KeyedBooleanFilterItem[] | null;

    @Field(
      () => (allKeys.length > 0 ? [KeyedIsNullFilterItem] : VoidResolver),
      {
        nullable: true,
        description: "The is-null filters to apply to the query",
      }
    )
    isNullFilters!: KeyedIsNullFilterItem[] | null;

    @Field(
      () =>
        stringFilterKeys.length > 0 ? [KeyedOneOfFilterItem] : VoidResolver,
      {
        nullable: true,
        description: "The one-of filters to apply to the query",
      }
    )
    oneOfFilters!: KeyedOneOfFilterItem[] | null;

    toSequelizeFindOptions<M extends Model<Record<string, unknown>>>(
      sortByMap: Partial<Record<AllKeys, OrderItemColumn>>,
      modelStatic?: ModelStatic<M>
    ): FindAndCountOptions<Attributes<M>> & {
      where: Partial<WhereAttributeHash<Attributes<M>>>;
    } {
      if (!modelStatic) {
        throw new Error(
          `No model static provided to ${resolverName} FilteredListQueryArgs`
        );
      }

      const options: FindAndCountOptions<Record<AllKeys, never>> = {
        ...super.toSequelizeFindOptions(sortByMap),
        col: `${modelStatic.name}.id`,
        distinct: true,
      };

      const whereOptions: Partial<WhereAttributeHash<Attributes<M>>> =
        filterToWhereOptions<
          AllKeys,
          StringFilterKeys,
          NumericFilterKeys,
          DateFilterKeys,
          BooleanFilterKeys
        >(this, sortByMap, resolverName);

      return {
        ...options,
        where: whereOptions,
      };
    }
  }

  return FilteredListQueryArgs;
}
