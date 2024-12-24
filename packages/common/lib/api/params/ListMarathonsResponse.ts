import { Matches } from "class-validator";
import { GraphQLNonEmptyString } from "graphql-scalars";
import { DateTime } from "luxon";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { MarathonNode } from "../resources/Marathon.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
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
  @Field(() => DateTimeScalar, { nullable: true })
  startDate?: DateTime | undefined | null;

  @IsAfterDateTime("startDate")
  @Field(() => DateTimeScalar, { nullable: true })
  endDate?: DateTime | undefined | null;
}

@InputType()
export class SetMarathonInput {
  @Matches(/^DB\d{2}$/, { message: "Year must be in the format DByy" })
  @Field(() => GraphQLNonEmptyString)
  year!: string;

  @IsBeforeDateTime("endDate")
  @Field(() => DateTimeScalar, { nullable: true })
  startDate?: DateTime | undefined | null;

  @IsAfterDateTime("startDate")
  @Field(() => DateTimeScalar, { nullable: true })
  endDate?: DateTime | undefined | null;
}

@ArgsType()
export class ListMarathonsArgs extends FilteredListQueryArgs(
  "MarathonResolver",
  ["year", "startDate", "endDate", "createdAt", "updatedAt"]
) {}
