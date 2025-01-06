import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  EventNode,
  GlobalIdScalar,
  ImageNode,
  LegacyError,
  LegacyErrorCode,
} from "@ukdanceblue/common";
import {
  CreateEventInput,
  ListEventsArgs,
  ListEventsResponse,
  SetEventInput,
} from "@ukdanceblue/common";
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
import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import {
  eventModelToResource,
  eventOccurrenceModelToResource,
} from "#repositories/event/eventModelToResource.js";
import { EventRepository } from "#repositories/event/EventRepository.js";
import { EventImagesRepository } from "#repositories/event/images/EventImagesRepository.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";

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
  event(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): AsyncRepositoryResult<EventNode> {
    return this.eventRepository
      .findOne({ by: { uuid: id } })
      .map((row) =>
        eventModelToResource(
          row,
          row.eventOccurrences.map(eventOccurrenceModelToResource)
        )
      );
  }

  @AccessControlAuthorized("list", "EventNode")
  @Query(() => ListEventsResponse, {
    name: "events",
    description: "List events",
  })
  events(@Args() query: ListEventsArgs) {
    return this.eventRepository
      .findAndCount({
        filters: query.filters,
        sortBy: query.sortBy,
        offset: query.offset,
        limit: query.limit,
        search: query.search,
      })
      .map(({ selectedRows, total }) => {
        return ListEventsResponse.newPaginated({
          data: selectedRows.map((row) =>
            eventModelToResource(
              row,
              row.eventOccurrences.map(eventOccurrenceModelToResource)
            )
          ),
          total,
        });
      });
  }

  @WithAuditLogging()
  @AccessControlAuthorized("create")
  @Mutation(() => EventNode, {
    name: "createEvent",
    description: "Create a new event",
  })
  createEvent(
    @Arg("input") input: CreateEventInput
  ): AsyncRepositoryResult<EventNode> {
    return this.eventRepository
      .create({
        init: {
          title: input.title,
          summary: input.summary,
          description: input.description,
          location: input.location,
          eventOccurrences: input.occurrences.map((occurrence) => ({
            interval: occurrence.interval.interval,
            fullDay: occurrence.fullDay,
          })),
        },
      })
      .map((row) =>
        eventModelToResource(
          row,
          row.eventOccurrences.map(eventOccurrenceModelToResource)
        )
      );
  }

  @WithAuditLogging()
  @AccessControlAuthorized("delete")
  @Mutation(() => EventNode, {
    name: "deleteEvent",
    description: "Delete an event by UUID",
  })
  deleteEvent(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): AsyncRepositoryResult<EventNode> {
    return this.eventRepository
      .delete({ by: { uuid: id } })
      .map((row) =>
        eventModelToResource(
          row,
          row.eventOccurrences.map(eventOccurrenceModelToResource)
        )
      );
  }

  @WithAuditLogging()
  @AccessControlAuthorized("update")
  @Mutation(() => EventNode, {
    name: "setEvent",
    description: "Update an event by UUID",
  })
  setEvent(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetEventInput
  ): AsyncRepositoryResult<EventNode> {
    return this.eventRepository
      .update({
        by: { uuid: id },
        init: {
          title: input.title,
          summary: input.summary,
          description: input.description,
          location: input.location,
          eventOccurrences: input.occurrences.map((occurrence) => ({
            interval: occurrence.interval.interval,
            fullDay: occurrence.fullDay,
          })),
        },
      })
      .map((row) =>
        eventModelToResource(
          row,
          row.eventOccurrences.map(eventOccurrenceModelToResource)
        )
      );
  }

  @WithAuditLogging()
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

  @WithAuditLogging()
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
    ).promise.then((result) => result.unwrap());
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
        ).promise.then((result) => result.unwrap())
      )
    );
  }
}
