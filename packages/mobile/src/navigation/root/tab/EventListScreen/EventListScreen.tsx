import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import InfinitePager from "react-native-infinite-pager";

import { EventListPage } from "./EventListPage";
import { LOADED_MONTHS_BEFORE_AFTER } from "./constants";
import { useEvents } from "./eventListUtils";

const DummyView = (
  <View
    onStartShouldSetResponder={() => true}
    onTouchEnd={(e) => {
      e.stopPropagation();
    }}
  >
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
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setTimeout(() => {
        setIsFirstRender(false);
      }, 0);
    }
  }, [isFirstRender]);
  // Calendar selection
  /*
  Assuming LOADED_MONTHS is 5:
  0 - Static loading screen
  1,2,3,4,5, - Calendar pages
  6 - Static loading screen
  */
  const [selectedMonth, setSelectedMonth] = useState<DateTime>(DateTime.now());

  // Earliest date to load (so we don't waste reads on events from 3 years ago)
  const lastEarliestTimestamp = useRef<DateTime>();
  const earliestTimestamp = useMemo(() => {
    const newEarliestTimestamp = selectedMonth.minus({
      months: LOADED_MONTHS_BEFORE_AFTER,
    }); // For example, if selectedMonth is 2021-05-01, then twoMonthsBeforeSelected is 2021-03-01
    if (
      lastEarliestTimestamp.current == null ||
      !newEarliestTimestamp.equals(lastEarliestTimestamp.current)
    ) {
      lastEarliestTimestamp.current = newEarliestTimestamp;
      return newEarliestTimestamp;
    } else {
      return lastEarliestTimestamp.current;
    }
  }, [selectedMonth]);

  // Navigation
  const { navigate } = useNavigation();

  const [markedDates, eventsByMonth, refreshing, refresh] = useEvents({
    earliestTimestamp,
  });

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {isFirstRender ? (
        DummyView
      ) : (
        <>
          <InfinitePager
            pageBuffer={7}
            onPageChange={(offset) => {
              setSelectedMonth(DateTime.now().plus({ months: offset }));
            }}
            style={{ height: "100%", width: "100%" }}
            initialIndex={0}
            renderPage={({ index }) => (
              <View
                key={index}
                style={{ height: "100%", width: "100%" }}
                collapsable={false}
              >
                <EventListPage
                  eventsByMonth={eventsByMonth}
                  marked={markedDates}
                  refreshing={refreshing}
                  refresh={refresh}
                  month={DateTime.now().plus({ months: index })}
                  tryToNavigate={(eventToNavigateTo, occurrenceUuid) =>
                    navigate("Event", {
                      event: eventToNavigateTo,
                      occurrenceId: occurrenceUuid,
                    })
                  }
                />
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default EventListScreen;
