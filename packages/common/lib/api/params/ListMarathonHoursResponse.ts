import { DateTimeISOResolver } from "graphql-scalars";
import { ArgsType,Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { MarathonHourNode } from "../resources/MarathonHour.js";
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
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  details?: string | null;

  @Field(() => String)
  durationInfo!: string;

  @Field(() => DateTimeISOResolver)
  shownStartingAt!: string;
}

@InputType()
export class SetMarathonHourInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  details?: string | null;

  @Field(() => String)
  durationInfo!: string;

  @Field(() => DateTimeISOResolver)
  shownStartingAt!: string;
}

@ArgsType()
export class ListMarathonHoursArgs extends FilteredListQueryArgs<
  | "title"
  | "details"
  | "durationInfo"
  | "marathonYear"
  | "shownStartingAt"
  | "createdAt"
  | "updatedAt",
  "title" | "details" | "durationInfo",
  "marathonYear",
  never,
  "shownStartingAt" | "createdAt" | "updatedAt",
  never
>("MarathonHourResolver", {
  all: [
    "title",
    "details",
    "durationInfo",
    "marathonYear",
    "shownStartingAt",
    "createdAt",
    "updatedAt",
  ],
  string: ["title", "details", "durationInfo"],
  oneOf: ["marathonYear"],
  date: ["shownStartingAt", "createdAt", "updatedAt"],
}) {}
