import { DateTimeISOResolver } from "graphql-scalars";
import { ObjectType, Field, InputType, ArgsType } from "type-graphql";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";
import { MarathonNode } from "../resources/Marathon.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";

@ObjectType("ListMarathonsResponse", {
  implements: AbstractGraphQLPaginatedResponse<MarathonNode[]>,
})
export class ListMarathonsResponse extends AbstractGraphQLPaginatedResponse<MarathonNode> {
  @Field(() => [MarathonNode])
  data!: MarathonNode[];
}

@InputType()
export class CreateMarathonInput {
  @Field()
  year!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  startDate?: string | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  endDate?: string | null;
}

@InputType()
export class SetMarathonInput {
  @Field(() => String)
  year!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  startDate?: string | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  endDate?: string | null;
}

@ArgsType()
export class ListMarathonsArgs extends FilteredListQueryArgs<
  "year" | "startDate" | "endDate" | "createdAt" | "updatedAt",
  never,
  "year",
  never,
  "startDate" | "endDate" | "createdAt" | "updatedAt",
  never
>("MarathonResolver", {
  all: ["year", "startDate", "endDate", "createdAt", "updatedAt"],
  oneOf: ["year"],
  date: ["startDate", "endDate", "createdAt", "updatedAt"],
}) {}
