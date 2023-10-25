import {
  DateRangeScalar,
  ErrorCode,
  EventResource,
  ImageResource,
} from "@ukdanceblue/common";
import { Interval } from "luxon";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { EventModel } from "../models/Event.js";
import { ImageModel } from "../models/Image.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import type {
  ResolverInterface,
  ResolverInterfaceWithFilteredList,
} from "./ResolverInterface.js";
import { FilteredListQueryArgs } from "./list-query-args/FilteredListQueryArgs.js";

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
export class EventOccurrenceInput {
  @Field(() => DateRangeScalar)
  occurrence!: Interval;
  @Field(() => Boolean)
  fullDay!: boolean;
}

@InputType()
class CreateEventInput {
  @Field()
  title!: string;

  @Field()
  summary!: string;

  @Field()
  location!: string;

  @Field(() => [EventOccurrenceInput])
  occurrences!: EventOccurrenceInput[];

  @Field()
  description!: string;
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
  @Query(() => GetEventByUuidResponse, { name: "event" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetEventByUuidResponse> {
    const row = await EventModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    return GetEventByUuidResponse.newOk(row.toResource());
  }

  @Query(() => ListEventsResponse, { name: "events" })
  async list(@Args() query: ListEventsArgs) {
    const findOptions = query.toSequelizeFindOptions(
      {
        title: "title",
        description: "description",
        location: "location",
        occurrence: "$occurrences.date$",
        duration: "duration",
      },
      EventModel
    );

    const { rows, count } = await EventModel.findAndCountAll(findOptions);

    return ListEventsResponse.newPaginated({
      data: rows.map((row) => row.toResource()),
      total: count,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => CreateEventResponse, { name: "createEvent" })
  async create(
    @Arg("input") input: CreateEventInput
  ): Promise<CreateEventResponse> {
    const row = await EventModel.create({
      title: input.title,
      description: input.description,
      location: input.location,
    });

    return CreateEventResponse.newOk(row.toResource());
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

  @FieldResolver(() => [ImageResource])
  async images(@Root() event: EventResource): Promise<ImageResource[]> {
    const row = await EventModel.findOne({
      where: { uuid: event.uuid },
      include: [{ model: ImageModel, as: "images" }],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    return row.images?.map((row) => row.toResource()) ?? [];
  }
}
