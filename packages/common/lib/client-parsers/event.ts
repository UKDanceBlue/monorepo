import { Interval } from "luxon";

interface EventOccurrence {
  fullDay: boolean;
  interval: string;
}

interface ParsedEventOccurrence {
  fullDay: boolean;
  interval: Interval;
}

export function parseEventOccurrence(
  occurrence: EventOccurrence
): ParsedEventOccurrence {
  return {
    fullDay: occurrence.fullDay,
    interval: Interval.fromISO(occurrence.interval),
  };
}

export function parsedEventOccurrenceToStrings(
  occurrence: ParsedEventOccurrence
): [string, string] {
  return occurrence.fullDay
    ? [
        occurrence.interval.start!.toFormat("yyyy-MM-dd"),
        occurrence.interval.end!.toFormat("yyyy-MM-dd"),
      ]
    : [
        occurrence.interval.start!.toFormat("yyyy-MM-dd' at 'HH:mm a"),
        occurrence.interval.end!.toFormat("yyyy-MM-dd' at 'HH:mm a"),
      ];
}
