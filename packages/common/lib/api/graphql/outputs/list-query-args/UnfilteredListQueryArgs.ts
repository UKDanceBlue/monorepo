import type {
  OrderItem,
  OrderItemAssociation,
  OrderItemColumn,
} from "@sequelize/core";
import type { OptionalToNullable, Resource } from "@ukdanceblue/common";
import { ArgsType, Field, Int } from "type-graphql";

import type { ListQueryType } from "../../../request/ListQueryTypes.js";
import { SortDirection } from "../../../request/ListQueryTypes.js";

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
    deprecationReason:
      "Soft-deletion is no longer used in this project, this parameter is ignored",
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
}
