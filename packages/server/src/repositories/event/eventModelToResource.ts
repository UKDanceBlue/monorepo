import type { Event, EventOccurrence } from "@prisma/client";
import {
  EventNode,
  EventOccurrenceNode,
  IntervalISO,
} from "@ukdanceblue/common";
import { DateTime } from "luxon";

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
    createdAt: DateTime.fromJSDate(eventModel.createdAt),
    updatedAt: DateTime.fromJSDate(eventModel.updatedAt),
  });
}

export function eventOccurrenceModelToResource(
  occurrenceModel: EventOccurrence
): EventOccurrenceNode {
  return EventOccurrenceNode.init({
    id: occurrenceModel.uuid,
    interval: IntervalISO.init(
      DateTime.fromJSDate(occurrenceModel.date),
      DateTime.fromJSDate(occurrenceModel.endDate)
    ),
    fullDay: occurrenceModel.fullDay,
  });
}
