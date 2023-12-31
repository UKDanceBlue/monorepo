import type {
  FindAndCountOptions,
  OrderItem,
  OrderItemAssociation,
  OrderItemColumn,
} from "@sequelize/core";
import type {
  ListQueryType,
  OptionalToNullable,
  Resource,
} from "@ukdanceblue/common";
import { SortDirection } from "@ukdanceblue/common";
import { ArgsType, Field, Int } from "type-graphql";

import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "./common.js";

export type UnorderedOrderItemArray =
  | [OrderItemAssociation, OrderItemColumn]
  | [OrderItemAssociation, OrderItemAssociation, OrderItemColumn]
  | [
      OrderItemAssociation,
      OrderItemAssociation,
      OrderItemAssociation,
      OrderItemColumn,
    ]
  | [
      OrderItemAssociation,
      OrderItemAssociation,
      OrderItemAssociation,
      OrderItemAssociation,
      OrderItemColumn,
    ];
undefined as unknown as UnorderedOrderItemArray satisfies OrderItem;

@ArgsType()
export class UnfilteredListQueryArgs<SortByKeys extends string = never>
  implements OptionalToNullable<Partial<ListQueryType<Resource>>>
{
  @Field(() => Boolean, {
    nullable: true,
    description: "Whether to include deleted items in the results",
  })
  includeDeleted!: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
    description:
      "Whether to send all results in a single page, defaults to false (should generally be avoided)",
  })
  sendAll!: boolean | null;

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
    columnMap?: Partial<Record<SortByKeys, OrderItemColumn>>,
    orderOverrideMap?: Partial<Record<SortByKeys, UnorderedOrderItemArray>>
  ): FindAndCountOptions<Record<SortByKeys, never>> {
    const options: FindAndCountOptions<Record<SortByKeys, never>> = {
      paranoid: this.includeDeleted === true ? false : true,
    };

    if (this.sendAll !== true) {
      if (this.pageSize != null) {
        options.limit = this.pageSize;
      }

      if (this.page != null) {
        options.offset = (this.page - FIRST_PAGE) * (this.pageSize ?? 10);
      }
    }

    if (this.sortBy != null && columnMap != null) {
      const sortBy = this.sortBy.map(
        (key) => orderOverrideMap?.[key] ?? columnMap[key]
      );
      const sortDirection =
        this.sortDirection?.map((v) =>
          v === SortDirection.DESCENDING ? "DESC" : "ASC"
        ) ?? this.sortBy.map(() => "ASC");

      options.order = sortBy
        .filter((key, index) => key != null && sortDirection[index] != null)
        .map((key, index) =>
          Array.isArray(key)
            ? [...(key as UnorderedOrderItemArray), sortDirection[index]!]
            : ([key!, sortDirection[index]!] as const)
        );
    }

    return options;
  }
}
