import type { ApiError, GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { modelServiceDeleteHelper, modelServiceGetByUuidHelper, modelServiceSetHelper } from "./helpers.js";
import { EventModel, EventIntermediate } from "../models/Event.js";


export class EventService implements GraphQLService.EventServiceInterface {
  async getByUuid(uuid: string): Promise<GraphQLResource.EventResource | ApiError<boolean> | null> {
    return modelServiceGetByUuidHelper("Event", "uuid", uuid, EventModel, EventIntermediate);
  }

  async set(uuid: string, data: GraphQLResource.EventResource): Promise<GraphQLResource.EventResource | ApiError<boolean>> {
    const [affected, result] = await EventModel.update(
      {
        title: data.title,
        summary: data.summary,
        description: data.description,
        location: data.location,
        duration: data.duration,
      },
      {
        where: {
          uuid,
        },
        returning: true,
      },
    );
    return modelServiceSetHelper("Event", uuid, affected, result, EventIntermediate);
  }

  async create(data: GraphQLResource.EventResource): Promise<ApiError<boolean> | { data?: GraphQLResource.EventResource; uuid: string; }> {
    const event = await EventModel.create({
      title: data.title,
      summary: data.summary,
      description: data.description,
      location: data.location,
      duration: data.duration,
    });
    const eventData = new EventIntermediate(event).toResource();
    return {
      data: eventData,
      uuid: event.uuid,
    };
  }

  async delete(uuid: string): Promise<ApiError<boolean> | boolean> {
    return modelServiceDeleteHelper("Event", "uuid", uuid, EventModel);
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.eventServiceToken, type: EventService });
