import { Matches } from "class-validator";
import { GraphQLDateTimeISO, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

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
  @Matches(/^DB\d{2}$/, { message: "Year must be in the format DByy" })
  @Field(() => GraphQLNonEmptyString)
  year!: string;

  @Field(() => GraphQLDateTimeISO, { nullable: true })
  startDate?: Date | undefined | null;

  @Field(() => GraphQLDateTimeISO, { nullable: true })
  endDate?: Date | undefined | null;
}

@InputType()
export class SetMarathonInput {
  @Matches(/^DB\d{2}$/, { message: "Year must be in the format DByy" })
  @Field(() => GraphQLNonEmptyString)
  year!: string;

  @Field(() => GraphQLDateTimeISO, { nullable: true })
  startDate?: Date | undefined | null;

  @Field(() => GraphQLDateTimeISO, { nullable: true })
  endDate?: Date | undefined | null;
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
