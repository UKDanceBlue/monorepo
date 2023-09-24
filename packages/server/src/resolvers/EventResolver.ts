import { DateTimeScalar, DurationScalar, ErrorCode, EventResource } from "@ukdanceblue/common";
import { DateTime, Duration } from "luxon";
import { Arg, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";

import { EventIntermediate, EventModel } from "../models/Event.js";

import { AbstractGraphQLCreatedResponse, AbstractGraphQLOkResponse, DetailedError } from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";

@ObjectType("GetEventByUuidResponse", { implements: AbstractGraphQLOkResponse<EventResource> })
class GetEventByUuidResponse extends AbstractGraphQLOkResponse<EventResource> {
  @Field(() => EventResource)
  data!: EventResource;
} @ObjectType("CreateEventResponse", { implements: AbstractGraphQLCreatedResponse<EventResource> })
class CreateEventResponse extends AbstractGraphQLCreatedResponse<EventResource> {
  @Field(() => EventResource)
  data!: EventResource;
}
@ObjectType("DeleteEventResponse", { implements: AbstractGraphQLOkResponse<boolean> })
class DeleteEventResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}
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

@Resolver(() => EventResource)
export class EventResolver implements ResolverInterface<EventResource> {
  @Query(() => GetEventByUuidResponse, { name: "getEventByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetEventByUuidResponse> {
    const row = await EventModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    return GetEventByUuidResponse.newOk(new EventIntermediate(row).toResource());
  }

  @Mutation(() => CreateEventResponse, { name: "createEvent" })
  async create(@Arg("input") input: CreateEventInput): Promise<CreateEventResponse> {
    const row = await EventModel.create({
      title: input.name,
      description: input.description,
      location: input.location,
      duration: input.duration,
    });

    return CreateEventResponse.newOk(new EventIntermediate(row).toResource());
  }

  @Mutation(() => DeleteEventResponse, { name: "deleteEvent" })
  async delete(@Arg("id") id: string): Promise<DeleteEventResponse> {
    const row = await EventModel.findOne({ where: { uuid: id }, attributes: ["id"] });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    await row.destroy();

    return DeleteEventResponse.newOk(true);
  }
}
