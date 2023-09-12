import FirestoreModule, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreEvent, FirestoreEventJson } from "@ukdanceblue/db-app-common";
import { MaybeWithFirestoreMetadata } from "@ukdanceblue/db-app-common/dist/firestore/internal";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { universalCatch } from "../../../../common/logging";
import { timestampToDateTime } from "../../../../common/util/dateTools";
import { useFirebase } from "../../../../context";

import { LOADED_MONTHS, RNCAL_DATE_FORMAT, RNCAL_DATE_FORMAT_NO_DAY } from "./constants";

/**
 * Converts a luxon DateTime to a string in the format used by react-native-calendars
 *
 * @param dateTime The DateTime to convert
 * @returns dateTime.toFormat(RNCAL_DATE_FORMAT)
 */
export function luxonDateTimeToDateString(dateTime: DateTime): string;
export function luxonDateTimeToDateString(dateTime: undefined): undefined;
export function luxonDateTimeToDateString(dateTime: null): null;
export function luxonDateTimeToDateString(dateTime: DateTime | undefined): string | undefined;
export function luxonDateTimeToDateString(dateTime: DateTime | null): string | null;
export function luxonDateTimeToDateString(dateTime: DateTime | undefined | null): string | undefined | null {
  if (dateTime == null) {
    return dateTime;
  } else {
    return dateTime.toFormat(RNCAL_DATE_FORMAT);
  }
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
export function luxonDateTimeToMonthString(dateTime: DateTime | undefined): string | undefined;
export function luxonDateTimeToMonthString(dateTime: DateTime | null): string | null;
export function luxonDateTimeToMonthString(dateTime: DateTime | undefined | null): string | undefined | null {
  if (dateTime == null) {
    return dateTime;
  } else {
    return dateTime.toFormat(RNCAL_DATE_FORMAT_NO_DAY);
  }
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
export function luxonDateTimeToDateData(dateTime: DateTime | undefined): DateData | undefined;
export function luxonDateTimeToDateData(dateTime: DateTime | null): DateData | null;
export function luxonDateTimeToDateData(dateTime: DateTime | undefined | null): DateData | undefined | null {
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
export function dateDataToLuxonDateTime(dateData: DateData | undefined): DateTime | undefined;
export function dateDataToLuxonDateTime(dateData: DateData | null): DateTime | null;
export function dateDataToLuxonDateTime(dateData: DateData | undefined | null): DateTime | undefined | null {
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
export const splitEvents = (events: FirestoreEvent[]) => {
  const newEvents: Partial<Record<string, FirestoreEvent[]>> = {};

  events
    .forEach((event) => {
      if (event.interval != null) {
        const eventDate: DateTime = timestampToDateTime(event.interval.start);
        const eventMonthDateString = eventDate.toFormat(RNCAL_DATE_FORMAT_NO_DAY);

        if (newEvents[eventMonthDateString] == null) {
          newEvents[eventMonthDateString] = [event];
        } else {
          newEvents[eventMonthDateString]?.push(event);
        }
      }
    });

  return newEvents;
};

/**
 * Gets the events for the given month and produces a MarkedDates object for react-native-calendars
 *
 * @param events The full list of events
 * @returns A MarkedDates object for react-native-calendars
 */
export const markEvents = (events: FirestoreEvent[]) => {
  const todayDateString = getTodayDateString();

  const marked: MarkedDates = {};

  let hasAddedToday = false;

  for (const event of events) {
    if (event.interval != null) {
      const eventDate: DateTime = timestampToDateTime(event.interval.start);
      const formattedDate = eventDate.toFormat(RNCAL_DATE_FORMAT);

      marked[formattedDate] = {
        marked: true,
        today: formattedDate === todayDateString,
      };
      if (formattedDate === todayDateString) {
        hasAddedToday = true;
      }
    }
  }

  // If we didn't add today or selected day already, we need to add them manually
  if (!hasAddedToday) {
    marked[todayDateString] = { today: true };
  }

  return marked;
};

export type UseEventsStateInternalReducerPayloads = {
  action: "reset";
  payload?: never;
} |
{
  action: "setEvents";
  payload: FirestoreEvent[];
};

export const useEventsStateInternal = () => useReducer(
  (
    prevState: Partial<Record<string, FirestoreEvent>>,
    {
      action, payload
    }: UseEventsStateInternalReducerPayloads
  ): Partial<Record<string, FirestoreEvent>> => {
    try {
      switch (action) {
      case "reset":
        return {};
      case "setEvents":{
        return Object.fromEntries(payload.map((event) => {
          const documentId = event.documentMetadata?.documentId;
          if (documentId) {
            return ([ documentId, event ]);
          } else {
            throw new Error("Event has no document metadata");
          }
        })) as Partial<Record<string, FirestoreEvent>>;
      }
      default:
        throw new Error("Invalid action");
      }
    } catch (e) {
      console.error(e);
      return prevState;
    }
  }
  , {}
);

export const getToday = () => DateTime.local().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
export const getTodayDateString = () => luxonDateTimeToDateString(getToday());

export async function loadEvents(earliestTimestamp: DateTime, fbFirestore: FirebaseFirestoreTypes.Module): Promise<{ eventsToSet: FirestoreEvent[] }> {
  const snapshot = await fbFirestore
    .collection<MaybeWithFirestoreMetadata<FirestoreEventJson>>("events")
    .where(new FirestoreModule.FieldPath("interval", "start"), ">=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.startOf("month").toMillis())) // For example, if earliestTimestamp is 2021-03-01, then we only load events from 2021-03-01 onwards
    .where(new FirestoreModule.FieldPath("interval", "start"), "<=", FirestoreModule.Timestamp.fromMillis(earliestTimestamp.plus({ months: LOADED_MONTHS - 1 }).endOf("month").toMillis())) // and before 2021-7-01, making the middle of the calendar 2021-05-01
    .orderBy(new FirestoreModule.FieldPath("interval", "start"), "asc")
    .get();

  const eventsToSet = [];

  for await (const doc of snapshot.docs) {
    let firestoreEvent: FirestoreEvent;
    try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      firestoreEvent = FirestoreEvent.fromSnapshot(doc);
    } catch (e) {
      console.error(e);
      continue;
    }
    eventsToSet.push(firestoreEvent);
  }

  return { eventsToSet };
}

export const useEvents = ({ earliestTimestamp }: {
  earliestTimestamp: DateTime;
}): [markedDates: MarkedDates, eventsByMonth: Partial<Record<string, FirestoreEvent[]>>, refreshing: boolean, refresh: () => Promise<void>] => {
  const lastEarliestTimestamp = useRef<DateTime | null>(null);

  const { fbFirestore } = useFirebase();
  const [ refreshing, setRefreshing ] = useState(false);
  const disableRefresh = useRef(false);

  const [ events, updateEvents ] = useEventsStateInternal();

  const refresh = useCallback(async (earliestTimestamp: DateTime) => {
    setRefreshing(true);
    disableRefresh.current = true;

    const { eventsToSet } = await loadEvents(earliestTimestamp, fbFirestore);

    updateEvents({
      action: "setEvents",
      payload: eventsToSet
    });
  }, [ fbFirestore, updateEvents ]);

  useEffect(() => {
    if (
      !disableRefresh.current &&
      (
        (lastEarliestTimestamp.current == null) ||
        Math.abs(earliestTimestamp.diff(lastEarliestTimestamp.current, "months").get("months")) >= 2.5
      )) {
      (refresh)(earliestTimestamp)
        .catch(universalCatch)
        .finally(() => {
          setRefreshing(false);
          disableRefresh.current = false;
          lastEarliestTimestamp.current = earliestTimestamp;
        });
    }
  }, [ earliestTimestamp, refresh ]);

  const eventsByMonth = useMemo(() => splitEvents(Object.values(events) as NonNullable<typeof events[string]>[]), [events]);

  const marked = useMemo(() => markEvents((Object.values(events) as NonNullable<typeof events[string]>[])), [events]);

  return [
    marked,
    eventsByMonth,
    refreshing,
    useCallback(
      () => refresh(earliestTimestamp)
        .catch(universalCatch)
        .finally(() => {
          setRefreshing(false);
          disableRefresh.current = false;
          lastEarliestTimestamp.current = earliestTimestamp;
        }),
      [ earliestTimestamp, refresh ]
    )
  ];
};
