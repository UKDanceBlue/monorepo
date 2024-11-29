import { NonNegativeIntResolver, PositiveIntResolver } from "graphql-scalars";
import type { ClassType } from "type-graphql";
import { Field, InterfaceType } from "type-graphql";

const DEFAULT_PAGE_SIZE = 10;
const FIRST_PAGE = 1;

@InterfaceType({
  description: "API response",
})
export abstract class AbstractGraphQLPaginatedResponse<T> {
  abstract data: T[];

  @Field(() => NonNegativeIntResolver, {
    description: "The total number of items",
  })
  total!: number;

  @Field(() => NonNegativeIntResolver, {
    description: "The number of items per page",
  })
  pageSize!: number;

  @Field(() => PositiveIntResolver, {
    description: "The current page number (1-indexed)",
  })
  page!: number;

  static newPaginated<T, PRes extends AbstractGraphQLPaginatedResponse<T>>(
    this: ClassType<PRes>,
    {
      data,
      total,
      page,
      pageSize,
    }: {
      data: T[];
      total: number;
      page?: number | undefined | null;
      pageSize?: number | undefined | null;
    }
  ): PRes {
    const response = new this();
    response.data = data;
    response.total = total;
    response.page = page ?? FIRST_PAGE;
    response.pageSize = pageSize ?? DEFAULT_PAGE_SIZE;
    return response;
  }
}
