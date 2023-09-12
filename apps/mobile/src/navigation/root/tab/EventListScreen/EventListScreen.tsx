import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import { LazyPagerView } from "react-native-pager-view";

import { EventListPage } from "./EventListPage";
import { LOADED_MONTHS_BEFORE_AFTER } from "./constants";
import { getToday, luxonDateTimeToMonthString, useEvents } from "./eventListUtils";

const AnimatedPager = Animated.createAnimatedComponent(LazyPagerView<DateTime>);

const monthCount = DateTime.now()
  .minus({ months: 12 })
  .until(DateTime.now().plus({ months: 12 }))
  .count("months");

const monthDates = (new Array(monthCount) as DateTime[])
  .fill(
    DateTime.now(),
    0,
    monthCount
  )
  .map((
    dateTime, i) => dateTime.plus({ months: i - (monthCount / 2) })
  );

const DummyView = (
  <View
    onStartShouldSetResponder={() => true}
    onTouchEnd={(e) => { e.stopPropagation(); }}>
    <EventListPage
      eventsByMonth={{}}
      marked={{}}
      refreshing={true}
      refresh={() => Promise.resolve()}
      month={DateTime.now()}
      tryToNavigate={() => undefined}
      disabled
    />
  </View>
);

const EventListScreen = () => {
  const lazyPagerRef = useRef<LazyPagerView<DateTime> | null>(null);
  const [ isFirstRender, setIsFirstRender ] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setTimeout(() => {
        setIsFirstRender(false);
      }, 0);
    }
  }, [isFirstRender]);
  const [ hasPagerRefBeenSet, setHasPagerRefBeenSet ] = useState(false);
  const [ hasSetPage, setHasSetPage ] = useState(false);
  const lastIndex = useRef<number | null>(null);
  // Calendar selection
  /*
  Assuming LOADED_MONTHS is 5:
  0 - Static loading screen
  1,2,3,4,5, - Calendar pages
  6 - Static loading screen
  */
  const [ selectedMonth, setSelectedMonth ] = useState<DateTime>(getToday());

  // Earliest date to load (so we don't waste reads on events from 3 years ago)
  const lastEarliestTimestamp = useRef<DateTime>();
  const earliestTimestamp = useMemo(() => {
    const newEarliestTimestamp = selectedMonth.minus({ months: LOADED_MONTHS_BEFORE_AFTER }); // For example, if selectedMonth is 2021-05-01, then twoMonthsBeforeSelected is 2021-03-01
    if (lastEarliestTimestamp.current == null || !newEarliestTimestamp.equals(lastEarliestTimestamp.current)) {
      lastEarliestTimestamp.current = newEarliestTimestamp;
      return newEarliestTimestamp;
    } else {
      return lastEarliestTimestamp.current;
    }
  }, [selectedMonth]);

  // Navigation
  const { navigate } = useNavigation();

  const [
    markedDates,
    eventsByMonth,
    refreshing,
    refresh,
  ] = useEvents({ earliestTimestamp });

  useLayoutEffect(() => {
    if (!hasSetPage && hasPagerRefBeenSet && lazyPagerRef.current != null) {
      lazyPagerRef.current.setPageWithoutAnimation(Math.ceil(monthCount / 2));
      setHasSetPage(true);
    }
  }, [ hasPagerRefBeenSet, hasSetPage ]);

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      {
        isFirstRender
          ? (DummyView)
          : (
            <AnimatedPager
              ref={(ref?: LazyPagerView<DateTime>) => {
                if (ref != null) {
                  lazyPagerRef.current = ref;
                  setHasPagerRefBeenSet(true);
                }
              }}
              buffer={1}
              maxRenderWindow={7}
              // Lib does not support dynamically orientation change
              orientation="horizontal"
              // Lib does not support dynamically transitionStyle change
              transitionStyle="scroll"
              data={
                monthDates
              }
              keyExtractor={(dateTime) => luxonDateTimeToMonthString(dateTime)}
              onPageScroll={({
                nativeEvent: {
                  offset, position
                }
              }) => {
                const index = Math.round(position + offset);
                if (index !== lastIndex.current && (position + offset) !== 0) {
                  lastIndex.current = index;
                  if (monthDates[index]) {
                    const month = monthDates[index];
                    if (!(month.startOf("month").equals(selectedMonth.startOf("month")))) {
                      setSelectedMonth(month);
                    }
                  } else {
                    console.warn("Index", index, "is out of bounds");
                    const month = monthDates[Math.floor(monthDates.length / 2)];
                    if (month as typeof monthDates[number] | undefined) {
                      setSelectedMonth(month);
                    }
                  }
                }
              }}
              style={{ height: "100%", width: "100%" }}
              renderItem={({ item: month }) => (
                <View key={luxonDateTimeToMonthString(month)} style={{ height: "100%", width: "100%" }} collapsable={false}>
                  <EventListPage
                    eventsByMonth={eventsByMonth}
                    marked={markedDates}
                    refreshing={refreshing}
                    refresh={refresh}
                    month={month}
                    tryToNavigate={(eventToNavigateTo) => navigate("Event", { event: eventToNavigateTo })}
                  />
                </View>
              )}
            />
          )
      }
    </SafeAreaView>);
};

export default EventListScreen;
