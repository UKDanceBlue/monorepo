import type { Event, EventOccurrence } from "@prisma/client";
import {
  EventNode,
  EventOccurrenceNode,
  IntervalISO,
} from "@ukdanceblue/common";

export function eventModelToResource(
  eventModel: Event,
  occurrences: EventOccurrenceNode[] = []
): EventNode {
  return EventNode.init({
    id: eventModel.uuid,
    title: eventModel.title,
    summary: eventModel.summary,
    description: eventModel.description,
    location: eventModel.location,
    occurrences,
    createdAt: eventModel.createdAt,
    updatedAt: eventModel.updatedAt,
  });
}

export function eventOccurrenceModelToResource(
  occurrenceModel: EventOccurrence
): EventOccurrenceNode {
  return EventOccurrenceNode.init({
    id: occurrenceModel.uuid,
    interval: IntervalISO.init(occurrenceModel.date, occurrenceModel.endDate),
    fullDay: occurrenceModel.fullDay,
  });
}
