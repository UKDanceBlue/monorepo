import { DateTimeISOResolver } from "graphql-scalars";
import { ArgsType,Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { MarathonNode } from "../resources/Marathon.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

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
