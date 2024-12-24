import { GraphQLNonEmptyString } from "graphql-scalars";
import { DateTime } from "luxon";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { MarathonHourNode } from "../resources/MarathonHour.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ObjectType("ListMarathonHoursResponse", {
  implements: AbstractGraphQLPaginatedResponse<MarathonHourNode[]>,
})
export class ListMarathonHoursResponse extends AbstractGraphQLPaginatedResponse<MarathonHourNode> {
  @Field(() => [MarathonHourNode])
  data!: MarathonHourNode[];
}

@InputType()
export class CreateMarathonHourInput {
  @Field(() => GraphQLNonEmptyString)
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  details?: string | undefined | null;

  @Field(() => GraphQLNonEmptyString)
  durationInfo!: string;

  @Field(() => DateTimeScalar)
  shownStartingAt!: DateTime;
}

@InputType()
export class SetMarathonHourInput {
  @Field(() => GraphQLNonEmptyString)
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  details?: string | undefined | null;

  @Field(() => GraphQLNonEmptyString)
  durationInfo!: string;

  @Field(() => DateTimeScalar)
  shownStartingAt!: DateTime;
}

@ArgsType()
export class ListMarathonHoursArgs extends FilteredListQueryArgs(
  "MarathonHourResolver",
  [
    "title",
    "details",
    "durationInfo",
    "marathonYear",
    "shownStartingAt",
    "createdAt",
    "updatedAt",
  ]
) {}
