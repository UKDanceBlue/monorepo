import { GraphQLNonNegativeInt, GraphQLPositiveInt } from "graphql-scalars";
import { ArgsType, Field, InputType, registerEnumType } from "type-graphql";

import { AbstractFilterGroup, createFilterGroup } from "../Filter.js";
import {
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  SortDirection,
} from "../ListQueryTypes.js";

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
    field!: Fields;
  }

  return Sort;
}

@ArgsType()
export abstract class AbstractFilteredListQueryArgs<Fields extends string> {
  filters!: AbstractFilterGroup<Fields> | null;
  sortBy!: AbstractSortItem<Fields>[] | null;

  @Field(() => Boolean, {
    nullable: true,
    description: "Whether to include deleted items in the results",
    deprecationReason:
      "Soft-deletion is no longer used in this project, this parameter is ignored",
  })
  includeDeleted!: boolean | null;

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
  pageSize!: number;

  @Field(() => GraphQLPositiveInt, {
    description: `The page number to return, defaults to ${String(FIRST_PAGE)}`,
    defaultValue: FIRST_PAGE,
  })
  page!: number;

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

  @ArgsType()
  abstract class FilteredListQueryArgs extends AbstractFilteredListQueryArgs<Fields> {
    @Field(() => FilterGroup)
    filters!: InstanceType<typeof FilterGroup> | null;

    @Field(() => [Sort], {
      nullable: true,
      description:
        "The fields to sort by, in order of priority. If unspecified, the sort order is undefined",
    })
    sortBy!: InstanceType<typeof Sort>[] | null;
  }

  return FilteredListQueryArgs;
}
