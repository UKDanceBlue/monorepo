import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { Column, Divider, Spinner, Text } from "native-base";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList } from "react-native";
import { DateData, MarkedDates } from "react-native-calendars/src/types";

import { universalCatch } from "../../../../common/logging";

import Calendar from "./Calendar";
import { EventListRenderItem } from "./EventListRenderItem";
import { dateDataToLuxonDateTime, luxonDateTimeToDateString, luxonDateTimeToMonthString } from "./eventListUtils";

export const EventListPage = ({
  month, eventsByMonth, marked, refresh, refreshing, tryToNavigate, disabled = false
}: {
  month: DateTime;
  eventsByMonth: Partial<Record<string, FirestoreEvent[]>>;
  marked: MarkedDates;
  refresh: () => Promise<void>;
  refreshing: boolean;
  tryToNavigate: (event: FirestoreEvent) => void;
  disabled?: boolean;
}) => {
  const monthString = luxonDateTimeToMonthString(month);

  const [ selectedDay, setSelectedDay ] = useState<DateData>();
  // Scroll-to-day functionality
  const eventsListRef = useRef<FlatList<FirestoreEvent> | null>(null);
  const dayIndexes = useRef<Partial<Record<string, number>>>({});
  dayIndexes.current = {};

  const [ refreshingManually, setRefreshingManually ] = useState(false);
  useEffect(() => {
    if (refreshingManually && !refreshing) {
      setRefreshingManually(false);
    }
  }, [ refreshingManually, refreshing ]);

  useEffect(() => {
    let scrollToDay = dateDataToLuxonDateTime(selectedDay);
    if (scrollToDay !== undefined && scrollToDay.invalidReason == null) {
      let failed = false;
      // Find the next day that has events, if none, fall back to the last day that has events
      let indexToCheck = dayIndexes.current[luxonDateTimeToDateString(scrollToDay)];
      while ((indexToCheck == null) && !failed) {
        scrollToDay = scrollToDay.plus({ days: 1 });
        if (!(scrollToDay.hasSame(month, "month"))) {
          failed = true;
        } else {
          indexToCheck = dayIndexes.current[luxonDateTimeToDateString(scrollToDay)];
        }
      }
      if (indexToCheck == null || failed) {
        // Go the other way
        scrollToDay = dateDataToLuxonDateTime(selectedDay);
        failed = false;
        if (scrollToDay !== undefined && scrollToDay.invalidReason == null) {
          while ((indexToCheck == null) && !failed) {
            scrollToDay = scrollToDay.minus({ days: 1 });
            if (!(scrollToDay.hasSame(month, "month"))) {
              failed = true;
            } else {
              indexToCheck = dayIndexes.current[luxonDateTimeToDateString(scrollToDay)];
            }
          }
        }
      }
      if (!failed && (indexToCheck != null)) {
        if (indexToCheck === 0) {
          // Not sure why, but scrollToIndex doesn't work if the index is 0
          eventsListRef.current?.scrollToOffset({ offset: 0, animated: true });
        } else {
          eventsListRef.current?.scrollToIndex({
            animated: true,
            index: indexToCheck,
          });
        }
      }
    }
  }, [ month, selectedDay ]);

  const markedWithSelected = useMemo(() => {
    const returnVal = { ...marked };
    if (selectedDay?.dateString) {
      returnVal[selectedDay.dateString] = {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        ...(returnVal[selectedDay.dateString] ?? {}),
        selected: true,
      };
    }
    return returnVal;
  }, [ marked, selectedDay?.dateString ]);

  return (
    <Column width="full" height="full">
      <Calendar
        initialDate={monthString}
        markedDates={markedWithSelected}
        hideExtraDays
        hideArrows
        theme={useMemo(() => ({ arrowColor: "#0032A0", textMonthFontWeight: "bold", textMonthFontSize: 20, textDayFontWeight: "bold", textDayHeaderFontWeight: "500" }), [])}
        displayLoadingIndicator={refreshing}
        onDayPress={setSelectedDay}
        style={{ width: "100%" }}
        disableAllTouchEventsForDisabledDays
        disabledByDefault={disabled}
      />
      <Divider height={"1"} backgroundColor="gray.400" />
      <FlatList
        ref={(list) => eventsListRef.current = list}
        data={ eventsByMonth[monthString] ?? [] }
        ListEmptyComponent={
          refreshing
            ? (<Spinner size="lg" mt={20} />)
            : (<Text style={{ textAlign: "center", marginTop: 20 }}>No events this month</Text>)
        }
        initialScrollIndex={selectedDay?.dateString ? (dayIndexes.current[selectedDay.dateString] ?? 0) : 0}
        extraData={selectedDay}
        style = {{ backgroundColor: "white", width: "100%" }}
        renderItem = {({
          item, index
        }) => (<EventListRenderItem
          item={item}
          index={index}
          dayIndexesRef={dayIndexes}
          tryToNavigate={tryToNavigate}
        />)}
        refreshing={refreshingManually}
        onRefresh={() => {
          setRefreshingManually(true);
          refresh().catch(universalCatch).finally(() => setRefreshingManually(false));
        }}
        onScrollToIndexFailed={console.error}
      />
    </Column>
  );
};
