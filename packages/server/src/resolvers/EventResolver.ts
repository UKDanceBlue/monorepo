import { DateTimeScalar, DurationScalar, ErrorCode, EventResource } from "@ukdanceblue/common";
import { DateTime, Duration } from "luxon";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { EventIntermediate, EventModel } from "../models/Event.js";

import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";

const GetEventByUuidResponse = defineGraphQlOkResponse("GetEventByUuidResponse", EventResource);
const CreateEventResponse = defineGraphQlCreatedResponse("CreateEventResponse", EventResource);
const DeleteEventResponse = defineGraphQlOkResponse("DeleteEventResponse", Boolean);

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


const GetByUuidResponseUnion = withGraphQLErrorUnion(GetEventByUuidResponse, "GetEventByUuidResponse");
const CreateResponseUnion = withGraphQLErrorUnion(CreateEventResponse, "CreateEventResponse");
const DeleteResponseUnion = withGraphQLErrorUnion(DeleteEventResponse, "DeleteEventResponse");

@Resolver(() => EventResource)
export class EventResolver implements ResolverInterface<EventResource> {
  @Query(() => GetByUuidResponseUnion, { name: "getEventByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<typeof GetByUuidResponseUnion> {
    const row = await EventModel.findOne({ where: { uuid } });

    if (row == null) {
      return GraphQLErrorResponse.from("Event not found", ErrorCode.NotFound);
    }

    return GetEventByUuidResponse.newOk(new EventIntermediate(row).toResource());
  }

  @Mutation(() => CreateResponseUnion, { name: "createEvent" })
  async create(@Arg("input") input: CreateEventInput): Promise<typeof CreateResponseUnion> {
    const row = await EventModel.create({
      title: input.name,
      description: input.description,
      location: input.location,
      duration: input.duration,
    });

    return CreateEventResponse.newOk(new EventIntermediate(row).toResource());
  }

  @Mutation(() => DeleteResponseUnion, { name: "deleteEvent" })
  async delete(@Arg("id") id: string): Promise<typeof DeleteResponseUnion> {
    const row = await EventModel.findOne({ where: { uuid: id }, attributes: ["id"] });

    if (row == null) {
      return GraphQLErrorResponse.from("Event not found", ErrorCode.NotFound);
    }

    await row.destroy();

    return DeleteEventResponse.newOk(true);
  }
}
