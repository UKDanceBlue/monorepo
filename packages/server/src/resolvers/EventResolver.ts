import { Service } from "@freshgum/typedi";
import type { Prisma } from "@prisma/client";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  EventNode,
  GlobalIdScalar,
  ImageNode,
  LegacyError,
  LegacyErrorCode,
  SortDirection,
} from "@ukdanceblue/common";
import {
  CreateEventInput,
  ListEventsArgs,
  ListEventsResponse,
  SetEventInput,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { VoidResolver } from "graphql-scalars";
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import type { GraphQLContext } from "#auth/context.js";
import { FileManager } from "#files/FileManager.js";
import {
  eventModelToResource,
  eventOccurrenceModelToResource,
} from "#repositories/event/eventModelToResource.js";
import { EventRepository } from "#repositories/event/EventRepository.js";
import { EventImagesRepository } from "#repositories/event/images/EventImagesRepository.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";

@Service([EventRepository, EventImagesRepository, FileManager])
@Resolver(() => EventNode)
export class EventResolver implements CrudResolver<EventNode, "event"> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventImageRepository: EventImagesRepository,
    private readonly fileManager: FileManager
  ) {}

  @AccessControlAuthorized("get")
  @Query(() => EventNode, {
    name: "event",
    description: "Get an event by UUID",
  })
  async event(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<EventNode> {
    const row = await this.eventRepository.findEventByUnique({ uuid: id });

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Event not found");
    }

    return eventModelToResource(
      row,
      row.eventOccurrences.map(eventOccurrenceModelToResource)
    );
  }

  @AccessControlAuthorized("list", "EventNode")
  @Query(() => ListEventsResponse, {
    name: "events",
    description: "List events",
  })
  async events(@Args() query: ListEventsArgs) {
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

  @AccessControlAuthorized("create")
  @Mutation(() => EventNode, {
    name: "createEvent",
    description: "Create a new event",
  })
  async createEvent(@Arg("input") input: CreateEventInput): Promise<EventNode> {
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

    return eventModelToResource(
      row,
      row.eventOccurrences.map(eventOccurrenceModelToResource)
    );
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => EventNode, {
    name: "deleteEvent",
    description: "Delete an event by UUID",
  })
  async deleteEvent(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<EventNode> {
    const row = await this.eventRepository.deleteEvent({ uuid: id });

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Event not found");
    }

    return eventModelToResource(
      row,
      row.eventOccurrences.map(eventOccurrenceModelToResource)
    );
  }

  @AccessControlAuthorized("update")
  @Mutation(() => EventNode, {
    name: "setEvent",
    description: "Update an event by UUID",
  })
  async setEvent(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetEventInput
  ): Promise<ConcreteResult<EventNode>> {
    const row = await this.eventRepository.updateEvent(
      { uuid: id },
      {
        title: input.title,
        summary: input.summary,
        description: input.description,
        location: input.location,
        eventOccurrences: input.occurrences,
      }
    );

    return row.map((row) => {
      return eventModelToResource(
        row,
        row.eventOccurrences.map(eventOccurrenceModelToResource)
      );
    });
  }

  @AccessControlAuthorized("update", "EventNode")
  @Mutation(() => VoidResolver, {
    name: "removeImageFromEvent",
    description: "Remove an image from an event",
  })
  async removeImage(
    @Arg("eventId", () => GlobalIdScalar) eventUuid: GlobalId,
    @Arg("imageId", () => GlobalIdScalar) imageUuid: GlobalId
  ): Promise<void> {
    const row = await this.eventImageRepository.removeEventImageByUnique({
      eventUuid: eventUuid.id,
      imageUuid: imageUuid.id,
    });

    if (!row) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Image not found");
    }
  }

  @AccessControlAuthorized("update", "EventNode")
  @Mutation(() => ImageNode, {
    name: "addExistingImageToEvent",
    description: "Add an existing image to an event",
  })
  async addExistingImage(
    @Ctx() { serverUrl }: GraphQLContext,
    @Arg("eventId", () => GlobalIdScalar) eventId: GlobalId,
    @Arg("imageId", () => GlobalIdScalar) imageId: GlobalId
  ): Promise<ImageNode> {
    const row = await this.eventImageRepository.addExistingImageToEvent(
      { uuid: eventId.id },
      { uuid: imageId.id }
    );

    return imageModelToResource(
      row.image,
      row.image.file,
      this.fileManager,
      serverUrl
    );
  }

  @FieldResolver(() => [ImageNode], {
    description: "List all images for this event",
  })
  async images(
    @Root() event: EventNode,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode[]> {
    const rows = await this.eventImageRepository.findEventImagesByEventUnique({
      uuid: event.id.id,
    });

    return Promise.all(
      rows.map((row) =>
        imageModelToResource(
          row.image,
          row.image.file,
          this.fileManager,
          serverUrl
        )
      )
    );
  }
}
