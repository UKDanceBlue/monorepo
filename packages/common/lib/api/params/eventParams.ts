import { GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { EventNode } from "../resources/Event.js";
import { GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { IntervalISO } from "../types/IntervalISO.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ObjectType("ListEventsResponse", {
  implements: AbstractGraphQLPaginatedResponse<EventNode[]>,
})
export class ListEventsResponse extends AbstractGraphQLPaginatedResponse<EventNode> {
  @Field(() => [EventNode])
  data!: EventNode[];
}

@InputType()
export class CreateEventOccurrenceInput {
  @Field(() => IntervalISO)
  interval!: IntervalISO;

  @Field(() => Boolean)
  fullDay!: boolean;
}

@InputType()
export class CreateEventInput {
  @Field(() => GraphQLNonEmptyString)
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  summary!: string | null;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  location!: string | null;

  @Field(() => [CreateEventOccurrenceInput])
  occurrences!: CreateEventOccurrenceInput[];

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  description!: string | null;
}

@InputType()
export class SetEventOccurrenceInput {
  @Field(() => GlobalIdScalar, {
    nullable: true,
    description:
      "If updating an existing occurrence, the GlobalId of the occurrence to update",
  })
  id!: GlobalId | null;

  @Field(() => IntervalISO)
  interval!: IntervalISO;
  @Field(() => Boolean)
  fullDay!: boolean;
}

@InputType()
export class SetEventInput {
  @Field()
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  summary!: string | null;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  location!: string | null;

  @Field(() => [SetEventOccurrenceInput])
  occurrences!: SetEventOccurrenceInput[];

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  description!: string | null;
}

@ArgsType()
export class ListEventsArgs extends FilteredListQueryArgs("EventResolver", [
  "title",
  "description",
  "summary",
  "location",
  "occurrences",
  "start",
  "end",
  "createdAt",
  "updatedAt",
]) {}
