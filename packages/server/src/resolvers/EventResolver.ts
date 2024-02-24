import type { Prisma } from "@prisma/client";
import {
  AccessControl,
  AccessLevel,
  DateRangeScalar,
  DetailedError,
  ErrorCode,
  EventResource,
  FilteredListQueryArgs,
  ImageResource,
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
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

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
class DeleteEventResponse extends AbstractGraphQLOkResponse<never> {}

@ObjectType("RemoveEventImageResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class RemoveEventImageResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("AddEventImageResponse", {
  implements: AbstractGraphQLOkResponse<ImageResource>,
})
class AddEventImageResponse extends AbstractGraphQLOkResponse<ImageResource> {
  @Field(() => ImageResource)
  data!: ImageResource;
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

@InputType()
class AddEventImageInput {
  // TODO: Make this a URL scalar, for some reason was getting 'Error: Schema must contain uniquely named types but contains multiple types named "URL".'
  @Field(() => String, { nullable: true })
  url!: string | null;

  @Field(() => String, { nullable: true })
  imageData!: string | null;

  @Field(() => String)
  mimeType!: string;

  @Field(() => String, { nullable: true })
  thumbHash!: string | null;

  @Field(() => String, { nullable: true })
  alt!: string | null;

  @Field(() => Int)
  width!: number;

  @Field(() => Int)
  height!: number;
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
@Resolver(() => EventResource)
export class EventResolver {
  constructor(
    private eventRepository: EventRepository,
    private eventImageRepository: EventImagesRepository
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
          ? query.page * query.pageSize
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

    return RemoveEventImageResponse.newOk(true);
  }

  @AccessControl({ accessLevel: AccessLevel.CommitteeChairOrCoordinator })
  @Mutation(() => AddEventImageResponse, { name: "addImageToEvent" })
  async addImage(
    @Arg("eventId") eventUuid: string,
    @Arg("input") input: AddEventImageInput
  ): Promise<AddEventImageResponse> {
    const row = await this.eventImageRepository.createEventImageForEvent(
      { uuid: eventUuid },
      {
        url: input.url,
        imageData: input.imageData
          ? Buffer.from(input.imageData, "base64")
          : null,
        mimeType: input.mimeType,
        thumbHash: input.thumbHash
          ? Buffer.from(input.thumbHash, "base64")
          : null,
        alt: input.alt,
        width: input.width,
        height: input.height,
      }
    );

    return AddEventImageResponse.newOk(imageModelToResource(row.image));
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

    return AddEventImageResponse.newOk(imageModelToResource(row.image));
  }

  @FieldResolver(() => [ImageResource])
  async images(@Root() event: EventResource): Promise<ImageResource[]> {
    const rows = await this.eventImageRepository.findEventImagesByEventUnique({
      uuid: event.uuid,
    });

    return rows.map((row) => imageModelToResource(row.image));
  }
}
