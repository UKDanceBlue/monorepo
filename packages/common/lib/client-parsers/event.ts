import { DateTime, Interval } from "luxon";

interface EventOccurrence {
  fullDay: boolean;
  occurrence: string;
}

interface ParsedEventOccurrence {
  fullDay: boolean;
  occurrence: Interval;
}

export function parseEventOccurrence(
  occurrence: EventOccurrence
): ParsedEventOccurrence {
  return {
    fullDay: occurrence.fullDay,
    occurrence: Interval.fromISO(occurrence.occurrence),
  };
}

export function parsedEventOccurrenceToString(
  occurrence: ParsedEventOccurrence
): string {
  return occurrence.fullDay
    ? occurrence.occurrence.toLocaleString(DateTime.DATE_SHORT)
    : occurrence.occurrence.toLocaleString(DateTime.DATETIME_SHORT);
}
