import type { Prisma } from "@prisma/client";
import {
  AccessControl,
  AccessLevel,
  DateRangeScalar,
  DetailedError,
  ErrorCode,
  EventNode,
  FilteredListQueryArgs,
  ImageNode,
  SortDirection,
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
import { Service } from "typedi";

import { FileManager } from "../lib/files/FileManager.js";
import { auditLogger } from "../lib/logging/auditLogging.js";
import { EventRepository } from "../repositories/event/EventRepository.js";
import {
  eventModelToResource,
  eventOccurrenceModelToResource,
} from "../repositories/event/eventModelToResource.js";
import { EventImagesRepository } from "../repositories/event/images/EventImagesRepository.js";
import { imageModelToResource } from "../repositories/image/imageModelToResource.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

@ObjectType("GetEventByUuidResponse", {
  implements: AbstractGraphQLOkResponse<EventNode>,
})
class GetEventByUuidResponse extends AbstractGraphQLOkResponse<EventNode> {
  @Field(() => EventNode)
  data!: EventNode;
}
@ObjectType("CreateEventResponse", {
  implements: AbstractGraphQLCreatedResponse<EventNode>,
})
class CreateEventResponse extends AbstractGraphQLCreatedResponse<EventNode> {
  @Field(() => EventNode)
  data!: EventNode;
}
@ObjectType("SetEventResponse", {
  implements: AbstractGraphQLOkResponse<EventNode>,
})
class SetEventResponse extends AbstractGraphQLOkResponse<EventNode> {
  @Field(() => EventNode)
  data!: EventNode;
}
@ObjectType("DeleteEventResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteEventResponse extends AbstractGraphQLOkResponse<never> {}

@ObjectType("RemoveEventImageResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class RemoveEventImageResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("AddEventImageResponse", {
  implements: AbstractGraphQLOkResponse<ImageNode>,
})
class AddEventImageResponse extends AbstractGraphQLOkResponse<ImageNode> {
  @Field(() => ImageNode)
  data!: ImageNode;
}

@ObjectType("ListEventsResponse", {
  implements: AbstractGraphQLPaginatedResponse<EventNode[]>,
})
class ListEventsResponse extends AbstractGraphQLPaginatedResponse<EventNode> {
  @Field(() => [EventNode])
  data!: EventNode[];
}

@InputType()
export class CreateEventOccurrenceInput {
  @Field(() => DateRangeScalar)
  interval!: Interval;
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
  interval!: Interval;
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
class ListEventsArgs extends FilteredListQueryArgs<
  | "title"
  | "description"
  | "summary"
  | "location"
  | "occurrence"
  | "occurrenceStart"
  | "occurrenceEnd"
  | "createdAt"
  | "updatedAt",
  "title" | "description" | "summary" | "location",
  never,
  never,
  | "occurrence"
  | "occurrenceStart"
  | "occurrenceEnd"
  | "createdAt"
  | "updatedAt",
  never
>("EventResolver", {
  all: [
    "title",
    "description",
    "summary",
    "location",
    "occurrence",
    "occurrenceStart",
    "occurrenceEnd",
    "createdAt",
    "updatedAt",
  ],
  string: ["title", "summary", "description", "location"],
  date: [
    "occurrence",
    "createdAt",
    "updatedAt",
    "occurrenceStart",
    "occurrenceEnd",
  ],
}) {}

@Service()
@Resolver(() => EventNode)
export class EventResolver {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventImageRepository: EventImagesRepository,
    private readonly fileManager: FileManager
  ) {}
  @Query(() => GetEventByUuidResponse, { name: "event" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetEventByUuidResponse> {
    const row = await this.eventRepository.findEventByUnique({ uuid });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    return GetEventByUuidResponse.newOk(
      eventModelToResource(
        row,
        row.eventOccurrences.map(eventOccurrenceModelToResource)
      )
    );
  }

  @Query(() => ListEventsResponse, { name: "events" })
  async list(@Args() query: ListEventsArgs) {
    const rows = await this.eventRepository.listEvents({
      filters: query.filters,
      order:
        query.sortBy?.map((key, i) => [
          key,
          query.sortDirection?.[i] ?? SortDirection.DESCENDING,
        ]) ?? [],
      skip:
        query.page != null && query.pageSize != null
          ? (query.page - 1) * query.pageSize
          : null,
      take: query.pageSize,
    });

    return ListEventsResponse.newPaginated({
      data: rows.map((row) =>
        eventModelToResource(
          row,
          row.eventOccurrences.map(eventOccurrenceModelToResource)
        )
      ),
      total: await this.eventRepository.countEvents({ filters: query.filters }),
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => CreateEventResponse, { name: "createEvent" })
  async create(
    @Arg("input") input: CreateEventInput
  ): Promise<CreateEventResponse> {
    const row = await this.eventRepository.createEvent({
      title: input.title,
      summary: input.summary,
      description: input.description,
      location: input.location,
      eventOccurrences: {
        createMany: {
          data: input.occurrences.map(
            (occurrence): Prisma.EventOccurrenceCreateManyEventInput => ({
              date: occurrence.interval.start!.toJSDate(),
              endDate: occurrence.interval.end!.toJSDate(),
              fullDay: occurrence.fullDay,
            })
          ),
        },
      },
    });

    auditLogger.sensitive("Event created", { event: row });

    return CreateEventResponse.newCreated(
      eventModelToResource(
        row,
        row.eventOccurrences.map(eventOccurrenceModelToResource)
      ),
      row.uuid
    );
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => DeleteEventResponse, { name: "deleteEvent" })
  async delete(@Arg("uuid") uuid: string): Promise<DeleteEventResponse> {
    const row = await this.eventRepository.deleteEvent({ uuid });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    auditLogger.sensitive("Event deleted", { uuid });

    return DeleteEventResponse.newOk(true);
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => SetEventResponse, { name: "setEvent" })
  async set(
    @Arg("uuid") uuid: string,
    @Arg("input") input: SetEventInput
  ): Promise<SetEventResponse> {
    const row = await this.eventRepository.updateEvent(
      { uuid },
      {
        title: input.title,
        summary: input.summary,
        description: input.description,
        location: input.location,
        eventOccurrences: {
          createMany: {
            data: input.occurrences
              .filter((occurrence) => occurrence.uuid == null)
              .map(
                (occurrence): Prisma.EventOccurrenceCreateManyEventInput => ({
                  date: occurrence.interval.start!.toJSDate(),
                  endDate: occurrence.interval.end!.toJSDate(),
                  fullDay: occurrence.fullDay,
                })
              ),
          },
          updateMany: input.occurrences
            .filter((occurrence) => occurrence.uuid != null)
            .map(
              (
                occurrence
              ): Prisma.EventOccurrenceUpdateManyWithWhereWithoutEventInput => ({
                where: { uuid: occurrence.uuid! },
                data: {
                  date: occurrence.interval.start!.toJSDate(),
                  endDate: occurrence.interval.end!.toJSDate(),
                  fullDay: occurrence.fullDay,
                },
              })
            ),
          // TODO: test if this delete also deletes the occurrences we are creating
          deleteMany: {
            uuid: {
              notIn: input.occurrences
                .filter((occurrence) => occurrence.uuid != null)
                .map((occurrence) => occurrence.uuid!),
            },
          },
        },
      }
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Event not found");
    }

    auditLogger.sensitive("Event updated", { event: row });

    return SetEventResponse.newOk(
      eventModelToResource(
        row,
        row.eventOccurrences.map(eventOccurrenceModelToResource)
      )
    );
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => RemoveEventImageResponse, { name: "removeImageFromEvent" })
  async removeImage(
    @Arg("eventId") eventUuid: string,
    @Arg("imageId") imageUuid: string
  ): Promise<RemoveEventImageResponse> {
    const row = await this.eventImageRepository.removeEventImageByUnique({
      eventUuid,
      imageUuid,
    });

    if (!row) {
      throw new DetailedError(ErrorCode.NotFound, "Image not found");
    }

    auditLogger.sensitive("Event image removed", { eventUuid, imageUuid });

    return RemoveEventImageResponse.newOk(true);
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => AddEventImageResponse, { name: "addExistingImageToEvent" })
  async addExistingImage(
    @Arg("eventId") eventId: string,
    @Arg("imageId") imageId: string
  ): Promise<AddEventImageResponse> {
    const row = await this.eventImageRepository.addExistingImageToEvent(
      { uuid: eventId },
      { uuid: imageId }
    );

    return AddEventImageResponse.newOk(
      await imageModelToResource(row.image, row.image.file, this.fileManager)
    );
  }

  @FieldResolver(() => [ImageNode])
  async images(@Root() event: EventNode): Promise<ImageNode[]> {
    const rows = await this.eventImageRepository.findEventImagesByEventUnique({
      uuid: event.uuid,
    });

    return Promise.all(
      rows.map((row) =>
        imageModelToResource(row.image, row.image.file, this.fileManager)
      )
    );
  }
}
