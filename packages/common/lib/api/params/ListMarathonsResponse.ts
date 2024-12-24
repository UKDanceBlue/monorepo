import { Matches } from "class-validator";
import { GraphQLDateTimeISO, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { MarathonNode } from "../resources/Marathon.js";
import {
  IsAfterDateTime,
  IsBeforeDateTime,
} from "../validation/beforeAfter.js";
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

  @IsBeforeDateTime("endDate")
  @Field(() => GraphQLDateTimeISO, { nullable: true })
  startDate?: Date | undefined | null;

  @IsAfterDateTime("startDate")
  @Field(() => GraphQLDateTimeISO, { nullable: true })
  endDate?: Date | undefined | null;
}

@InputType()
export class SetMarathonInput {
  @Matches(/^DB\d{2}$/, { message: "Year must be in the format DByy" })
  @Field(() => GraphQLNonEmptyString)
  year!: string;

  @IsBeforeDateTime("endDate")
  @Field(() => GraphQLDateTimeISO, { nullable: true })
  startDate?: Date | undefined | null;

  @IsAfterDateTime("startDate")
  @Field(() => GraphQLDateTimeISO, { nullable: true })
  endDate?: Date | undefined | null;
}

@ArgsType()
export class ListMarathonsArgs extends FilteredListQueryArgs(
  "MarathonResolver",
  ["year", "startDate", "endDate", "createdAt", "updatedAt"]
) {}
