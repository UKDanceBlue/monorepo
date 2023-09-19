import { DateTime, Duration } from "luxon";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";

import { DateTimeScalar } from "@ukdanceblue/common/lib/api/graphql/custom-scalars/DateTimeScalar.js"
import { DurationScalar } from "@ukdanceblue/common/lib/api/graphql/custom-scalars/DurationScalar.js"
import { defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "@ukdanceblue/common";
import { EventResource } from "@ukdanceblue/common/lib/api/graphql/object-types/Event.js";
import { eventServiceToken } from "../service-declarations/EventServiceInterface.js";

import { createBaseResolver } from "./BaseResolver.js";
import { resolverCreateHelper, resolverSetHelper } from "./helpers.js";

const EventBaseResolver = createBaseResolver(
  "Event",
  EventResource,
  eventServiceToken
);

const CreateEventResponse = defineGraphQlCreatedResponse("CreateEventResponse", EventResource);
const SetEventResponse = defineGraphQlOkResponse("SetEventResponse", EventResource);

@InputType()
class CreateEventInput {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field()
  location!: string;

  @Field(() => DateTimeScalar)
  start!: DateTime;

  @Field(() => DurationScalar)
  duration!: Duration;
}

@InputType()
class SetEventInput {
  @Field()
  name!: string;

  @Field()
  description?: string;

  @Field()
  location?: string;

  @Field(() => DateTimeScalar)
  start?: DateTime;

  @Field(() => DurationScalar)
  duration?: Duration;
}

const CreateEventResponseUnion = withGraphQLErrorUnion(CreateEventResponse);
const SetEventResponseUnion = withGraphQLErrorUnion(SetEventResponse);

@Resolver()
export class EventResolver extends EventBaseResolver {
  @Mutation(() => CreateEventResponseUnion)
  async createEvent(
    @Arg("input") input: CreateEventInput
  ): Promise<typeof CreateEventResponseUnion> {
    const result = await this.service.create(input);
    return resolverCreateHelper(CreateEventResponse, result);
  }

  @Mutation(() => SetEventResponseUnion)
  async setEvent(
    @Arg("id") id: string,
    @Arg("input") input: SetEventInput
  ): Promise<typeof SetEventResponseUnion> {
    const result = await this.service.set(id, {
      title: input.name,
      description: input.description,
      location: input.location,
      occurrences: [
        input.start
      ].filter((x): x is DateTime => x !== undefined),
      duration: input.duration,
    });
    return resolverSetHelper(SetEventResponse, result);
  }
}
