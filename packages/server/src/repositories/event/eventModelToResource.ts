import type { Event } from "@prisma/client";
import { EventResource } from "@ukdanceblue/common";

export function eventModelToResource(eventModel: Event): EventResource {
  return EventResource.init({
    uuid: eventModel.uuid,
  });
}
