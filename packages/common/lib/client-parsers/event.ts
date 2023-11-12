import { Interval } from "luxon";

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

export function parsedEventOccurrenceToStrings(
  occurrence: ParsedEventOccurrence
): [string, string] {
  return occurrence.fullDay
    ? [
        occurrence.occurrence.start!.toFormat("yyyy-MM-dd"),
        occurrence.occurrence.end!.toFormat("yyyy-MM-dd"),
      ]
    : [
        occurrence.occurrence.start!.toFormat("yyyy-MM-dd' at 'HH:mm a"),
        occurrence.occurrence.end!.toFormat("yyyy-MM-dd' at 'HH:mm a"),
      ];
}
