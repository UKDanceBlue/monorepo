import type { Event, EventOccurrence } from "@prisma/client";
import { EventNode, EventOccurrenceNode } from "@ukdanceblue/common";
import { DateTime, Interval } from "luxon";

export function eventModelToResource(
  eventModel: Event,
  occurrences: EventOccurrenceNode[] = []
): EventNode {
  return EventNode.init({
    uuid: eventModel.uuid,
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
    uuid: occurrenceModel.uuid,
    interval: Interval.fromDateTimes(
      DateTime.fromJSDate(occurrenceModel.date),
      DateTime.fromJSDate(occurrenceModel.endDate)
    ),
    fullDay: occurrenceModel.fullDay,
  });
}
