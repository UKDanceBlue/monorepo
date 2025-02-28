import { GraphQLNonEmptyString } from "graphql-scalars";
import { DateTime } from "luxon";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { MarathonHourNode } from "../resources/MarathonHour.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ObjectType("ListMarathonHoursResponse", {
  implements: AbstractGraphQLPaginatedResponse<MarathonHourNode[]>,
})
export class ListMarathonHoursResponse extends AbstractGraphQLPaginatedResponse<MarathonHourNode> {
  @Field(() => [MarathonHourNode], { nullable: false })
  data!: MarathonHourNode[];
}

@InputType()
export class CreateMarathonHourInput {
  @Field(() => GraphQLNonEmptyString, { nullable: false })
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  details?: string | undefined | null;

  @Field(() => GraphQLNonEmptyString, { nullable: false })
  durationInfo!: string;

  @Field(() => DateTimeScalar, { nullable: false })
  shownStartingAt!: DateTime;
}

@InputType()
export class SetMarathonHourInput {
  @Field(() => GraphQLNonEmptyString, { nullable: false })
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  details?: string | undefined | null;

  @Field(() => GraphQLNonEmptyString, { nullable: false })
  durationInfo!: string;

  @Field(() => DateTimeScalar, { nullable: false })
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
