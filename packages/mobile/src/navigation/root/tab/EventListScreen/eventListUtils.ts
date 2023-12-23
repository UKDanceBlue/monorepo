import { universalCatch } from "@common/logging";
import { showMessage } from "@common/util/alertUtils";
import { EventScreenFragment } from "@navigation/root/EventScreen/EventScreenFragment";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { DateTime, Interval } from "luxon";
import { useEffect, useMemo } from "react";
import type { DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";
import { useQuery } from "urql";

import {
  LOADED_MONTHS,
  RNCAL_DATE_FORMAT,
  RNCAL_DATE_FORMAT_NO_DAY,
} from "./constants";

/**
 * Converts a luxon DateTime to a string in the format used by react-native-calendars
 *
 * @param dateTime The DateTime to convert
 * @returns dateTime.toFormat(RNCAL_DATE_FORMAT)
 */
export function luxonDateTimeToDateString(dateTime: DateTime): string;
export function luxonDateTimeToDateString(dateTime: undefined): undefined;
export function luxonDateTimeToDateString(dateTime: null): null;
export function luxonDateTimeToDateString(
  dateTime: DateTime | undefined
): string | undefined;
export function luxonDateTimeToDateString(
  dateTime: DateTime | null
): string | null;
export function luxonDateTimeToDateString(
  dateTime: DateTime | undefined | null
): string | undefined | null {
  return dateTime == null ? dateTime : dateTime.toFormat(RNCAL_DATE_FORMAT);
}

/**
 * Converts a luxon DateTime to a month string in the format used by react-native-calendars
 *
 * @param dateTime The DateTime to convert
 * @returns dateTime.toFormat(RNCAL_DATE_FORMAT_NO_DAY)
 */
export function luxonDateTimeToMonthString(dateTime: DateTime): string;
export function luxonDateTimeToMonthString(dateTime: undefined): undefined;
export function luxonDateTimeToMonthString(dateTime: null): null;
export function luxonDateTimeToMonthString(
  dateTime: DateTime | undefined
): string | undefined;
export function luxonDateTimeToMonthString(
  dateTime: DateTime | null
): string | null;
export function luxonDateTimeToMonthString(
  dateTime: DateTime | undefined | null
): string | undefined | null {
  return dateTime == null
    ? dateTime
    : dateTime.toFormat(RNCAL_DATE_FORMAT_NO_DAY);
}

/**
 * Converts a luxon DateTime to a react-native-calendars date object
 *
 * Constructed using the day, month, and year components of DateTime, the DateTime.toMillis() method, and luxonDateTimeToDateString
 *
 * @param dateTime The DateTime to convert
 * @returns A date object corresponding to dateTime
 */
export function luxonDateTimeToDateData(dateTime: DateTime): DateData;
export function luxonDateTimeToDateData(dateTime: undefined): undefined;
export function luxonDateTimeToDateData(dateTime: null): null;
export function luxonDateTimeToDateData(
  dateTime: DateTime | undefined
): DateData | undefined;
export function luxonDateTimeToDateData(
  dateTime: DateTime | null
): DateData | null;
export function luxonDateTimeToDateData(
  dateTime: DateTime | undefined | null
): DateData | undefined | null {
  if (dateTime == null) {
    return dateTime;
  } else {
    return {
      dateString: luxonDateTimeToDateString(dateTime),
      day: dateTime.day,
      month: dateTime.month,
      year: dateTime.year,
      timestamp: dateTime.toMillis(),
    };
  }
}

/**
 * Converts a react-native-calendars date object to a luxon DateTime
 *
 * Constructed using only the day, month, and year components of dateData
 *
 * @param dateData The date object to convert
 * @returns A DateTime corresponding to dateData
 */
export function dateDataToLuxonDateTime(dateData: DateData): DateTime;
export function dateDataToLuxonDateTime(dateData: undefined): undefined;
export function dateDataToLuxonDateTime(dateData: null): null;
export function dateDataToLuxonDateTime(
  dateData: DateData | undefined
): DateTime | undefined;
export function dateDataToLuxonDateTime(
  dateData: DateData | null
): DateTime | null;
export function dateDataToLuxonDateTime(
  dateData: DateData | undefined | null
): DateTime | undefined | null {
  if (dateData == null) {
    return dateData;
  } else {
    return DateTime.fromObject(
      {
        day: dateData.day,
        month: dateData.month,
        year: dateData.year,
      },
      { zone: "utc" }
    );
  }
}

/**
 * Splits a list of events into an object keyed by month string
 *
 * @param events The events to split
 * @returns An object keyed by month string, with the values being the events in that month
 */
export const splitEvents = (
  events: readonly FragmentType<typeof EventScreenFragment>[]
) => {
  const newEvents: Partial<
    Record<
      string,
      [
        event: FragmentType<typeof EventScreenFragment>,
        occurrenceUuid: string,
      ][]
    >
  > = {};

  for (const event of events) {
    const eventData = getFragmentData(EventScreenFragment, event);

    for (const occurrence of eventData.occurrences) {
      const occurrenceInterval = Interval.fromISO(occurrence.interval);
      const monthString = luxonDateTimeToMonthString(occurrenceInterval.start);

      if (newEvents[monthString] == null) {
        newEvents[monthString] = [[event, occurrence.uuid]];
      } else {
        newEvents[monthString]!.push([event, occurrence.uuid]);
      }
    }
  }

  return newEvents;
};

/**
 * Gets the events for the given month and produces a MarkedDates object for react-native-calendars
 *
 * @param events The full list of events
 * @returns A MarkedDates object for react-native-calendars
 */
export const markEvents = (
  events: readonly FragmentType<typeof EventScreenFragment>[]
) => {
  const marked: MarkedDates = {};

  for (const event of events) {
    const eventData = getFragmentData(EventScreenFragment, event);

    for (const occurrence of eventData.occurrences) {
      const interval = Interval.fromISO(occurrence.interval);

      interval.set({
        start: interval.start.startOf("day"),
        end: interval.end.endOf("day"),
      });

      let date = interval.start.plus({ hour: 1 });

      while (interval.contains(date)) {
        const dateString = luxonDateTimeToDateString(date);

        marked[dateString] = { marked: true };

        date = date.plus({ days: 1 });
      }
    }
  }

  marked[getTodayDateString()] = { today: true };

  return marked;
};

export const getTodayDateString = () =>
  luxonDateTimeToDateString(DateTime.now());

export const useEvents = ({
  earliestTimestamp,
}: {
  earliestTimestamp: DateTime;
}): [
  markedDates: MarkedDates,
  eventsByMonth: ReturnType<typeof splitEvents>,
  refreshing: boolean,
  refresh: () => void,
] => {
  const [eventsQueryResult, refresh] = useQuery({
    query: graphql(/* GraphQL */ `
      query Events(
        $earliestTimestamp: LuxonDateTime!
        $lastTimestamp: LuxonDateTime!
      ) {
        events(
          dateFilters: [
            {
              comparison: GREATER_THAN_OR_EQUAL_TO
              field: occurrence
              value: $earliestTimestamp
            }
            {
              comparison: LESS_THAN_OR_EQUAL_TO
              field: occurrence
              value: $lastTimestamp
            }
          ]
        ) {
          data {
            ...EventScreenFragment
          }
        }
      }
    `),
    variables: {
      earliestTimestamp: earliestTimestamp.toISO(),
      lastTimestamp: earliestTimestamp
        .plus({ months: LOADED_MONTHS - 1 })
        .endOf("month")
        .toISO(),
    },
  });

  useEffect(() => {
    if (!eventsQueryResult.fetching && eventsQueryResult.error != null) {
      universalCatch(eventsQueryResult.error);
      showMessage(
        eventsQueryResult.error.message,
        eventsQueryResult.error.name
      );
    }
  });

  const eventsByMonth = useMemo(
    () => splitEvents(eventsQueryResult.data?.events.data ?? []),
    [eventsQueryResult.data]
  );

  const marked = useMemo(
    () => markEvents(eventsQueryResult.data?.events.data ?? []),
    [eventsQueryResult.data?.events.data]
  );

  return [marked, eventsByMonth, eventsQueryResult.fetching, refresh];
};
