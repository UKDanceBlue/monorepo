import {
  GraphQLNonEmptyString,
  GraphQLNonNegativeInt,
  GraphQLPositiveInt,
} from "graphql-scalars";
import { ArgsType, Field, InputType, registerEnumType } from "type-graphql";

import { AbstractFilterGroup, createFilterGroup } from "./Filter.js";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  SortDirection,
} from "./ListQueryTypes.js";

@InputType()
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export abstract class AbstractSortItem<Field extends string> {
  field!: Field;

  @Field(() => SortDirection, { defaultValue: SortDirection.asc })
  direction!: SortDirection;
}

export function SortItem<Fields extends string>(
  resolverName: string,
  fieldsEnum: Record<string, Fields>
) {
  @InputType(`${resolverName}Sort`)
  class Sort extends AbstractSortItem<Fields> {
    @Field(() => fieldsEnum)
    declare field: Fields;
  }

  return Sort;
}

@InputType()
export abstract class AbstractSearchFilter<Field extends string> {
  @Field(() => GraphQLNonEmptyString, {
    nullable: false,
  })
  declare query: string;
  declare fields?: Field[] | null | undefined;
}

export function SearchFilter<Fields extends string>(
  resolverName: string,
  fieldsEnum: Record<string, Fields>
) {
  @InputType(`${resolverName}SearchFilter`)
  class SearchFilter extends AbstractSearchFilter<Fields> {
    @Field(() => [fieldsEnum], {
      nullable: true,
      description:
        "The fields to search in. If unspecified, searches all searchable fields. Note that searching by a field that does not support it will cause a runtime error",
    })
    declare fields?: Fields[] | null;
  }

  return SearchFilter;
}

@ArgsType()
export abstract class AbstractFilteredListQueryArgs<Fields extends string> {
  filters!: AbstractFilterGroup<Fields> | null;
  sortBy!: AbstractSortItem<Fields>[] | null;
  search!: AbstractSearchFilter<Fields> | null;

  @Field(() => Boolean, {
    nullable: true,
    description:
      "Whether to send all results in a single page, defaults to false (should generally be avoided)",
    defaultValue: false,
  })
  sendAll = false;

  @Field(() => GraphQLNonNegativeInt, {
    description: `The number of items to return per page, defaults to ${String(
      DEFAULT_PAGE_SIZE
    )}`,
    defaultValue: DEFAULT_PAGE_SIZE,
  })
  declare pageSize: number;

  @Field(() => GraphQLPositiveInt, {
    description: `The page number to return, defaults to ${String(FIRST_PAGE)}`,
    defaultValue: FIRST_PAGE,
  })
  declare page: number;

  get offset() {
    if (this.sendAll) {
      return 0;
    }
    return (this.page - 1) * this.pageSize;
  }
  get limit() {
    if (this.sendAll) {
      return undefined;
    }
    return this.pageSize;
  }
}

export type FieldsOfListQueryArgs<T> =
  T extends AbstractFilteredListQueryArgs<infer Fields> ? Fields : never;

export function FilteredListQueryArgs<Fields extends string>(
  resolverName: string,
  fields: Fields[] = []
) {
  const FilterKeysEnum = Object.fromEntries(fields.map((v) => [v, v]));
  registerEnumType(FilterKeysEnum, {
    name: `${resolverName}FilterFields`,
  });

  const FilterGroup = createFilterGroup(FilterKeysEnum, resolverName);
  const Sort = SortItem(resolverName, FilterKeysEnum);
  const Search = SearchFilter(resolverName, FilterKeysEnum);

  @ArgsType()
  abstract class FilteredListQueryArgs extends AbstractFilteredListQueryArgs<Fields> {
    @Field(() => FilterGroup, { nullable: true })
    declare filters: InstanceType<typeof FilterGroup> | null;

    @Field(() => [Sort], {
      nullable: true,
      description:
        "The fields to sort by, in order of priority. If unspecified, the sort order is undefined",
    })
    declare sortBy: InstanceType<typeof Sort>[] | null;

    @Field(() => Search, { nullable: true })
    declare search: InstanceType<typeof Search> | null;
  }

  return FilteredListQueryArgs;
}
