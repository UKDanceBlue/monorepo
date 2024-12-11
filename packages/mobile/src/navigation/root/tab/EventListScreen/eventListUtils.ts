import { intervalFromSomething } from "@ukdanceblue/common";
import type { Interval } from "luxon";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef } from "react";
import type { DateData } from "react-native-calendars";
import type { MarkedDates } from "react-native-calendars/src/types";
import { useQuery } from "urql";

import { Logger } from "@/common/logger/Logger";
import { showMessage } from "@/common/util/alertUtils";
import type { FragmentType } from "@/graphql/index";
import { graphql, readFragment } from "@/graphql/index";
import { EventScreenFragment } from "@/navigation/root/EventScreen/EventScreenFragment";

import { RNCAL_DATE_FORMAT, RNCAL_DATE_FORMAT_NO_DAY } from "./constants";

/**
 * Converts a luxon DateTime to a string in the format used by react-native-calendars
 *
 * @param dateTime The DateTime to convert
 * @returns dateTime.toFormat(RNCAL_DATE_FORMAT)
 */
export function luxonDateTimeToDateString(dateTime: DateTime): string {
  return dateTime.toFormat(RNCAL_DATE_FORMAT);
}

/**
 * Converts a luxon DateTime to a month string in the format used by react-native-calendars
 *
 * @param dateTime The DateTime to convert
 * @returns dateTime.toFormat(RNCAL_DATE_FORMAT_NO_DAY)
 */
export function luxonDateTimeToMonthString(dateTime: DateTime): string {
  return dateTime.toFormat(RNCAL_DATE_FORMAT_NO_DAY);
}

/**
 * Converts a luxon DateTime to a react-native-calendars date object
 *
 * Constructed using the day, month, and year components of DateTime, the DateTime.toMillis() method, and luxonDateTimeToDateString
 *
 * @param dateTime The DateTime to convert
 * @returns A date object corresponding to dateTime
 */
export function luxonDateTimeToDateData(dateTime: DateTime): DateData {
  return {
    dateString: luxonDateTimeToDateString(dateTime),
    day: dateTime.day,
    month: dateTime.month,
    year: dateTime.year,
    timestamp: dateTime.toMillis(),
  };
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

  const calendarEvents = events
    .flatMap((event) => {
      const eventData = readFragment(EventScreenFragment, event);
      return eventData.occurrences.map(
        (occurrence) =>
          [
            event,
            {
              ...occurrence,
              interval: intervalFromSomething(occurrence.interval),
            },
          ] as const
      );
    })
    .sort((a, b) =>
      (a[1].interval.start ?? 0) > (b[1].interval.start ?? 0) ? 1 : -1
    );

  for (const [event, occurrence] of calendarEvents) {
    console.log(
      readFragment(EventScreenFragment, event).title,

      occurrence.interval.start?.toISO()
    );
    if (!occurrence.interval.isValid) {
      continue;
    }
    const monthString = luxonDateTimeToMonthString(occurrence.interval.start);
    const existingEvents = newEvents[monthString] ?? [];
    newEvents[monthString] = [...existingEvents, [event, occurrence.id]];
  }

  return newEvents;
};

const ONE_DAY_EVENT_COLOR = "#33B";
const MULTI_DAY_EVENT_COLOR = "#3d3d80";

/**
 * Gets the events for the given month and produces a MarkedDates
 * object for react-native-calendars
 *
 * Our logic for marking a date is:
 *
 * 1. Always mark the start date of an event
 * 2. Always mark today
 * 3. If the end date of an event is the same as the start
 *    date, do nothing else
 * 4. If the end date of an event is different from the
 *    start date AND is more than 24 hours after the start
 *    date, mark every day the event is on
 * 5. If the end date of an event is different from the
 *    start date but is less than 24 hours after the start
 *    do nothing else
 *
 * @param events The full list of events
 * @returns A MarkedDates object for react-native-calendars
 */
export const markEvents = (
  events: readonly FragmentType<typeof EventScreenFragment>[]
) => {
  const marked: Partial<MarkedDates> = {};

  for (const event of events) {
    const eventData = readFragment(EventScreenFragment, event);

    for (const occurrence of eventData.occurrences) {
      const interval = intervalFromSomething(occurrence.interval);

      if (!interval.isValid) {
        continue;
      }

      if (interval.start.diff(interval.end).as("hours") < 24) {
        const dateString = luxonDateTimeToDateString(interval.start);
        const existingDots = marked[dateString]?.dots ?? [];
        marked[dateString] = {
          dots:
            existingDots.length < 3
              ? [
                  ...existingDots,
                  {
                    color: ONE_DAY_EVENT_COLOR,
                  },
                ]
              : existingDots,
        };
      } else {
        for (const day of interval.splitBy({ day: 1 })) {
          if (!day.isValid) {
            continue;
          }

          const dateString = luxonDateTimeToDateString(
            (day as Interval<true>).start
          );
          const existingDots = marked[dateString]?.dots ?? [];
          marked[dateString] = {
            dots:
              existingDots.length < 3
                ? [
                    ...existingDots,
                    {
                      color: MULTI_DAY_EVENT_COLOR,
                    },
                  ]
                : existingDots,
          };
        }
      }
    }
  }

  marked[getTodayDateString()] = {
    ...(marked[getTodayDateString()] ?? {}),
    today: true,
  };

  return marked;
};

export const getTodayDateString = () =>
  luxonDateTimeToDateString(DateTime.now());

export const useEvents = ({
  month,
}: {
  month: DateTime<true> | DateTime<false>;
}): [
  markedDates: Partial<MarkedDates>,
  eventsByMonth: ReturnType<typeof splitEvents>,
  refreshing: boolean,
  refresh: () => void,
] => {
  if (!month.isValid) {
    throw new Error("Invalid month");
  }

  const [eventsQueryResult, refresh] = useQuery({
    query: graphql(/* GraphQL */ `
      query Events(
        $earliestTimestamp: DateTimeISO!
        $lastTimestamp: DateTimeISO!
      ) {
        events(
          dateFilters: [
            {
              comparison: GREATER_THAN_OR_EQUAL_TO
              field: occurrenceStart
              value: $earliestTimestamp
            }
            {
              comparison: LESS_THAN_OR_EQUAL_TO
              field: occurrenceStart
              value: $lastTimestamp
            }
          ]
          sortDirection: asc
          sortBy: "occurrence"
        ) {
          data {
            ...EventScreenFragment
          }
        }
      }
    `),
    variables: {
      earliestTimestamp: month.startOf("month").toISO(),
      lastTimestamp: month.endOf("month").toISO(),
    },
  });

  const lastFetchKey = useRef<number | null>(null);
  useEffect(() => {
    if (lastFetchKey.current !== eventsQueryResult.operation?.key) {
      if (!eventsQueryResult.fetching && eventsQueryResult.error == null) {
        Logger.debug(
          `successfully fetched ${
            eventsQueryResult.data?.events.data.length
          } events for ${month.toFormat("yyyy-LL")} from ${
            eventsQueryResult.operation?.context.meta?.cacheOutcome === "hit"
              ? "cache"
              : "network"
          }`,
          { tags: ["graphql"], source: "useEvents" }
        );
      }
      lastFetchKey.current = eventsQueryResult.operation?.key ?? null;
    }
  }, [
    eventsQueryResult.data,
    eventsQueryResult.error,
    eventsQueryResult.fetching,
    eventsQueryResult.operation?.context.meta?.cacheOutcome,
    eventsQueryResult.operation?.key,
    month,
  ]);

  useEffect(() => {
    if (!eventsQueryResult.fetching && eventsQueryResult.error != null) {
      Logger.error(`failed to fetch events for ${month.toFormat("yyyy-LL")}`, {
        error: eventsQueryResult.error,
        tags: ["graphql"],
        source: "useEvents",
      });
      showMessage(
        eventsQueryResult.error.message,
        eventsQueryResult.error.name
      );
    }
  }, [eventsQueryResult.error, eventsQueryResult.fetching, month]);

  const eventsByMonth = useMemo(
    () => splitEvents(eventsQueryResult.data?.events.data ?? []),
    [eventsQueryResult.data]
  );

  const marked = useMemo(
    () => markEvents(eventsQueryResult.data?.events.data ?? []),
    [eventsQueryResult.data?.events.data]
  );

  return [
    marked,
    eventsByMonth,
    eventsQueryResult.fetching,
    () => refresh({ requestPolicy: "network-only" }),
  ];
};
