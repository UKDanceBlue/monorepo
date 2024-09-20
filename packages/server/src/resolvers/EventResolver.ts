import { FileManager } from "#files/FileManager.js";
import { auditLogger } from "#logging/auditLogging.js";
import { EventRepository } from "#repositories/event/EventRepository.js";
import {
  eventModelToResource,
  eventOccurrenceModelToResource,
} from "#repositories/event/eventModelToResource.js";
import { EventImagesRepository } from "#repositories/event/images/EventImagesRepository.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";

import {
  AccessControl,
  AccessLevel,
  CommitteeRole,
  LegacyError,
  LegacyErrorCode,
  EventNode,
  GlobalIdScalar,
  ImageNode,
  SortDirection,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "@freshgum/typedi";

import type { Prisma } from "@prisma/client";
import type { GlobalId } from "@ukdanceblue/common";
import {
  GetEventByUuidResponse,
  ListEventsResponse,
  ListEventsArgs,
  CreateEventResponse,
  CreateEventInput,
  DeleteEventResponse,
  SetEventResponse,
  SetEventInput,
  RemoveEventImageResponse,
  AddEventImageResponse,
} from "@ukdanceblue/common";

@Service([EventRepository, EventImagesRepository, FileManager])
@Resolver(() => EventNode)
export class EventResolver {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventImageRepository: EventImagesRepository,
    private readonly fileManager: FileManager
  ) {}
  @Query(() => GetEventByUuidResponse, {
    name: "event",
    description: "Get an event by UUID",
  })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<GetEventByUuidResponse> {
    const row = await this.eventRepository.findEventByUnique({ uuid: id });

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Event not found");
    }

    return GetEventByUuidResponse.newOk(
      eventModelToResource(
        row,
        row.eventOccurrences.map(eventOccurrenceModelToResource)
      )
    );
  }

  @Query(() => ListEventsResponse, {
    name: "events",
    description: "List events",
  })
  async list(@Args() query: ListEventsArgs) {
    const rows = await this.eventRepository.listEvents({
      filters: query.filters,
      order:
        query.sortBy?.map((key, i) => [
          key,
          query.sortDirection?.[i] ?? SortDirection.desc,
        ]) ?? [],
      skip:
        query.page != null && query.actualPageSize != null
          ? (query.page - 1) * query.actualPageSize
          : null,
      take: query.actualPageSize,
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
      pageSize: query.actualPageSize,
    });
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => CreateEventResponse, {
    name: "createEvent",
    description: "Create a new event",
  })
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
              date: occurrence.interval.start,
              endDate: occurrence.interval.end,
              fullDay: occurrence.fullDay,
            })
          ),
        },
      },
    });

    auditLogger.secure("Event created", { event: row });

    return CreateEventResponse.newCreated(
      eventModelToResource(
        row,
        row.eventOccurrences.map(eventOccurrenceModelToResource)
      )
    );
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => DeleteEventResponse, {
    name: "deleteEvent",
    description: "Delete an event by UUID",
  })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeleteEventResponse> {
    const row = await this.eventRepository.deleteEvent({ uuid: id });

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Event not found");
    }

    auditLogger.secure("Event deleted", { uuid: id });

    return DeleteEventResponse.newOk(true);
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => SetEventResponse, {
    name: "setEvent",
    description: "Update an event by UUID",
  })
  async set(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetEventInput
  ): Promise<SetEventResponse> {
    const row = await this.eventRepository.updateEvent(
      { uuid: id },
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
                  date: occurrence.interval.start,
                  endDate: occurrence.interval.end,
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
                where: { uuid: occurrence.uuid!.id },
                data: {
                  date: occurrence.interval.start,
                  endDate: occurrence.interval.end,
                  fullDay: occurrence.fullDay,
                },
              })
            ),
          // TODO: test if this delete also deletes the occurrences we are creating
          deleteMany: {
            uuid: {
              notIn: input.occurrences
                .filter((occurrence) => occurrence.uuid != null)
                .map((occurrence) => occurrence.uuid!.id),
            },
          },
        },
      }
    );

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Event not found");
    }

    auditLogger.secure("Event updated", { event: row });

    return SetEventResponse.newOk(
      eventModelToResource(
        row,
        row.eventOccurrences.map(eventOccurrenceModelToResource)
      )
    );
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => RemoveEventImageResponse, {
    name: "removeImageFromEvent",
    description: "Remove an image from an event",
  })
  async removeImage(
    @Arg("eventId", () => GlobalIdScalar) eventUuid: GlobalId,
    @Arg("imageId", () => GlobalIdScalar) imageUuid: GlobalId
  ): Promise<RemoveEventImageResponse> {
    const row = await this.eventImageRepository.removeEventImageByUnique({
      eventUuid: eventUuid.id,
      imageUuid: imageUuid.id,
    });

    if (!row) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Image not found");
    }

    auditLogger.secure("Event image removed", { eventUuid, imageUuid });

    return RemoveEventImageResponse.newOk(true);
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => AddEventImageResponse, {
    name: "addExistingImageToEvent",
    description: "Add an existing image to an event",
  })
  async addExistingImage(
    @Arg("eventId", () => GlobalIdScalar) eventId: GlobalId,
    @Arg("imageId", () => GlobalIdScalar) imageId: GlobalId
  ): Promise<AddEventImageResponse> {
    const row = await this.eventImageRepository.addExistingImageToEvent(
      { uuid: eventId.id },
      { uuid: imageId.id }
    );

    return AddEventImageResponse.newOk(
      await imageModelToResource(row.image, row.image.file, this.fileManager)
    );
  }

  @FieldResolver(() => [ImageNode], {
    description: "List all images for this event",
  })
  async images(@Root() event: EventNode): Promise<ImageNode[]> {
    const rows = await this.eventImageRepository.findEventImagesByEventUnique({
      uuid: event.id.id,
    });

    return Promise.all(
      rows.map((row) =>
        imageModelToResource(row.image, row.image.file, this.fileManager)
      )
    );
  }
}
