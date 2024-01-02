import { Logger } from "@common/logger/Logger";
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

  const now = DateTime.now();
  const thisMonth = Interval.fromDateTimes(
    now.startOf("month"),
    now.endOf("month")
  );

  for (const event of events) {
    const eventData = getFragmentData(EventScreenFragment, event);

    for (const occurrence of eventData.occurrences) {
      const occurrenceInterval = Interval.fromISO(occurrence.interval);

      if (!occurrenceInterval.start.hasSame(occurrenceInterval.end, "month")) {
        if (
          (occurrenceInterval.intersection(thisMonth)?.length("hours") ?? 0) <
          24
        ) {
          continue;
        }
      }

      const startMonthString = luxonDateTimeToMonthString(
        occurrenceInterval.start
      );

      if (newEvents[startMonthString] == null) {
        newEvents[startMonthString] = [[event, occurrence.uuid]];
      } else {
        newEvents[startMonthString]!.push([event, occurrence.uuid]);
      }

      if (!occurrenceInterval.start.hasSame(occurrenceInterval.end, "month")) {
        const endMonthString = luxonDateTimeToMonthString(
          occurrenceInterval.end
        );

        if (newEvents[endMonthString] == null) {
          newEvents[endMonthString] = [[event, occurrence.uuid]];
        } else {
          newEvents[endMonthString]!.push([event, occurrence.uuid]);
        }
      }
    }
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
    const eventData = getFragmentData(EventScreenFragment, event);

    for (const occurrence of eventData.occurrences) {
      const interval = Interval.fromISO(occurrence.interval);

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
          const dateString = luxonDateTimeToDateString(day.start);
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

  marked[getTodayDateString()] = { today: true };

  return marked as MarkedDates;
};

export const getTodayDateString = () =>
  luxonDateTimeToDateString(DateTime.now());

export const useEvents = ({
  month,
}: {
  month: DateTime;
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
          sortDirection: ASCENDING
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

  useEffect(() => {
    if (eventsQueryResult.fetching) {
      Logger.debug(`fetching events for ${month.toFormat("yyyy-LL")}`, {
        tags: ["graphql"],
        source: "useEvents",
      });
    }
  }, [eventsQueryResult.fetching, month]);

  useEffect(() => {
    if (!eventsQueryResult.fetching && eventsQueryResult.error == null) {
      Logger.debug(
        `successfully fetched ${eventsQueryResult.data?.events.data
          .length} events for ${month.toFormat("yyyy-LL")}`,
        { tags: ["graphql"], source: "useEvents" }
      );
    }
  }, [
    eventsQueryResult.data,
    eventsQueryResult.error,
    eventsQueryResult.fetching,
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
  });

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
