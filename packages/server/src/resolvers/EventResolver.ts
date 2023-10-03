import {
  DateTimeScalar,
  DurationScalar,
  ErrorCode,
  EventResource,
} from "@ukdanceblue/common";
import { DateTime, Duration } from "luxon";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { EventIntermediate, EventModel } from "../models/Event.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import { FilteredListQueryArgs } from "./ListQueryArgs.js";
import type {
  ResolverInterface,
  ResolverInterfaceWithFilteredList,
} from "./ResolverInterface.js";

@ObjectType("GetEventByUuidResponse", {
  implements: AbstractGraphQLOkResponse<EventResource>,
})
class GetEventByUuidResponse extends AbstractGraphQLOkResponse<EventResource> {
  @Field(() => EventResource)
  data!: EventResource;
}
@ObjectType("CreateEventResponse", {
  implements: AbstractGraphQLCreatedResponse<EventResource>,
})
class CreateEventResponse extends AbstractGraphQLCreatedResponse<EventResource> {
  @Field(() => EventResource)
  data!: EventResource;
}
@ObjectType("DeleteEventResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteEventResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("ListEventsResponse", {
  implements: AbstractGraphQLPaginatedResponse<EventResource[]>,
})
class ListEventsResponse extends AbstractGraphQLPaginatedResponse<EventResource> {
  @Field(() => [EventResource])
  data!: EventResource[];
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

@ArgsType()
class ListEventsArgs extends FilteredListQueryArgs("EventResolver", {
  all: [
    "title",
    "description",
    "summary",
    "location",
    "occurrence",
    "duration",
    "createdAt",
    "updatedAt",
  ],
  string: ["title", "summary", "description", "location"],
  numeric: ["duration"],
  date: ["occurrence", "createdAt", "updatedAt"],
}) {}

@Resolver(() => EventResource)
export class EventResolver
  implements
    ResolverInterface<EventResource>,
    ResolverInterfaceWithFilteredList<EventResource, ListEventsArgs>
{
  @Query(() => GetEventByUuidResponse, { name: "getEventByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetEventByUuidResponse> {
    const row = await EventModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    return GetEventByUuidResponse.newOk(
      new EventIntermediate(row).toResource()
    );
  }

  @Query(() => ListEventsResponse, { name: "listEvents" })
  async list(@Args() query: ListEventsArgs) {
    const findOptions = query.toSequelizeFindOptions({
      title: "title",
      description: "description",
      location: "location",
      occurrence: "$occurrences.date$",
      duration: "duration",
    });

    const { rows, count } = await EventModel.findAndCountAll(findOptions);

    return ListEventsResponse.newPaginated(
      rows.map((row) => new EventIntermediate(row).toResource()),
      count,
      query.page,
      query.pageSize
    );
  }

  @Mutation(() => CreateEventResponse, { name: "createEvent" })
  async create(
    @Arg("input") input: CreateEventInput
  ): Promise<CreateEventResponse> {
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
    const row = await EventModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    await row.destroy();

    return DeleteEventResponse.newOk(true);
  }
}
