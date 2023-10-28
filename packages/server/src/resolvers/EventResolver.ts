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

import { sequelizeDb } from "../data-source.js";
import { EventModel } from "../models/Event.js";
import { EventOccurrenceModel } from "../models/EventOccurrence.js";
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
@ObjectType("SetEventResponse", {
  implements: AbstractGraphQLOkResponse<EventResource>,
})
class SetEventResponse extends AbstractGraphQLOkResponse<EventResource> {
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
export class CreateEventOccurrenceInput {
  @Field(() => DateRangeScalar)
  occurrence!: Interval;
  @Field(() => Boolean)
  fullDay!: boolean;
}

@InputType()
class CreateEventInput {
  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  summary!: string | null;

  @Field(() => String, { nullable: true })
  location!: string | null;

  @Field(() => [CreateEventOccurrenceInput])
  occurrences!: CreateEventOccurrenceInput[];

  @Field(() => String, { nullable: true })
  description!: string | null;
}

@InputType()
export class SetEventOccurrenceInput {
  @Field(() => String, {
    nullable: true,
    description:
      "If updating an existing occurrence, the UUID of the occurrence to update",
  })
  uuid!: string | null;
  @Field(() => DateRangeScalar)
  occurrence!: Interval;
  @Field(() => Boolean)
  fullDay!: boolean;
}

@InputType()
class SetEventInput {
  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  summary!: string | null;

  @Field(() => String, { nullable: true })
  location!: string | null;

  @Field(() => [SetEventOccurrenceInput])
  occurrences!: SetEventOccurrenceInput[];

  @Field(() => String, { nullable: true })
  description!: string | null;
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

  @Mutation(() => SetEventResponse, { name: "setEvent" })
  async set(
    @Arg("uuid") uuid: string,
    @Arg("input") input: SetEventInput
  ): Promise<SetEventResponse> {
    const result = await sequelizeDb.transaction(async () => {
      const basicEvent = await EventModel.findOne({
        where: { uuid },
        attributes: ["id"],
      });

      if (basicEvent == null) {
        throw new DetailedError(ErrorCode.NotFound, "Event not found");
      }

      const rowId = basicEvent.id;

      const row = await basicEvent.update({
        title: input.title,
        summary: input.summary,
        description: input.description,
        location: input.location,
      });

      const occurrencesToDelete: EventOccurrenceModel[] = [];
      const occurrencesToUpdate: EventOccurrenceModel[] = [];
      const occurrencesToCreate: CreateEventOccurrenceInput[] = [];

      for (const occurrence of row.occurrences ?? []) {
        const inputOccurrence = input.occurrences.find(
          (inputOccurrence) => inputOccurrence.uuid === occurrence.uuid
        );
        if (inputOccurrence == null) {
          occurrencesToDelete.push(occurrence);
        } else {
          occurrencesToUpdate.push(occurrence);
        }
      }
      for (const inputOccurrence of input.occurrences) {
        if (
          !row.occurrences?.some(
            (occurrence) => occurrence.uuid === inputOccurrence.uuid
          )
        ) {
          occurrencesToCreate.push(inputOccurrence);
        }
      }

      const promises = [
        // Delete any occurrences that are no longer in the input
        ...occurrencesToDelete.map(async (occurrence) => {
          await occurrence.destroy();
          return undefined;
        }),

        // Update any occurrences that are in the input
        ...occurrencesToUpdate.map((occurrence) => {
          const inputOccurrence = input.occurrences.find(
            (inputOccurrence) => inputOccurrence.uuid === occurrence.uuid
          );
          if (inputOccurrence == null) {
            throw new DetailedError(
              ErrorCode.InvalidRequest,
              "Invalid occurrence"
            );
          }
          const {
            occurrence: { start, end },
            fullDay,
          } = inputOccurrence;
          if (start == null || end == null) {
            throw new DetailedError(
              ErrorCode.InvalidRequest,
              "Invalid occurrence"
            );
          }
          return occurrence.update({
            date: start.toJSDate(),
            endDate: end.toJSDate(),
            fullDay,
          });
        }),

        // Create any occurrences that are only in the input
        ...occurrencesToCreate.map((inputOccurrence) => {
          const {
            occurrence: { start, end },
            fullDay,
          } = inputOccurrence;
          if (start == null || end == null) {
            throw new DetailedError(
              ErrorCode.InvalidRequest,
              "Invalid occurrence"
            );
          }
          return EventOccurrenceModel.create({
            eventId: rowId,
            date: start.toJSDate(),
            endDate: end.toJSDate(),
            fullDay,
          });
        }),
      ];

      await Promise.all(promises);

      return row;
    });

    return SetEventResponse.newOk(result.toResource());
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
