import type { FindAndCountOptions, OrderItemColumn } from "@sequelize/core";
import type {
  ListQueryType,
  OptionalToNullable,
  Resource,
} from "@ukdanceblue/common";
import { SortDirection } from "@ukdanceblue/common";
import { ArgsType, Field, Int } from "type-graphql";

import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "./common.js";

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
    sortByMap?: Partial<Record<SortByKeys, OrderItemColumn>>
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
