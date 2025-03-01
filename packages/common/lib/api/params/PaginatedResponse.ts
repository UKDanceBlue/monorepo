import { NonNegativeIntResolver } from "graphql-scalars";
import type { ClassType } from "type-graphql";
import { Field, InterfaceType } from "type-graphql";

@InterfaceType({
  description: "API response",
})
export abstract class AbstractGraphQLPaginatedResponse<T> {
  abstract data: T[];

  @Field(() => NonNegativeIntResolver, {
    description: "The total number of items",
    nullable: false,
  })
  total!: number;

  static newPaginated<T, PRes extends AbstractGraphQLPaginatedResponse<T>>(
    this: ClassType<PRes>,
    {
      data,
      total,
    }: {
      data: T[];
      total: number;
    }
  ): PRes {
    const response = new this();
    response.data = data;
    response.total = total;
    return response;
  }
}
