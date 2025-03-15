import { useNavigation } from "@react-navigation/native";
import { ErrorBoundary } from "@sentry/react-native";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { View } from "react-native";
import type { MarkedDates } from "react-native-calendars/src/types";
import type { InfinitePagerPageComponent } from "react-native-infinite-pager";
import InfinitePager from "react-native-infinite-pager";

import { useNetworkStatus } from "@/common/customHooks";

import { EventListPage } from "./EventListPage";
import { useEvents } from "./eventListUtils";

function DummyView() {
  return (
    <View
      onStartShouldSetResponder={() => true}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
    >
      <EventListPage
        eventsByMonth={{}}
        marked={{}}
        refreshing={false}
        refresh={() => Promise.resolve()}
        month={DateTime.now()}
        tryToNavigate={() => undefined}
        disabled
        offline
      />
    </View>
  );
}

const EventListScreen = () => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setTimeout(() => {
        setIsFirstRender(false);
      }, 0);
    }
  }, [isFirstRender]);

  const [{ isInternetReachable }] = useNetworkStatus();

  if (isInternetReachable === false || isFirstRender) {
    return <DummyView />;
  }

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <InfinitePager
      pageBuffer={1}
      initialIndex={0}
      PageComponent={EventListScreenPage}
    />
  );
};

export default EventListScreen;

const EventListScreenPage: InfinitePagerPageComponent = ({
  index,
}: {
  index: number;
}) => {
  const shownMonth = DateTime.now().plus({ months: index });
  const [markedDates, eventsByMonth, refreshing, refresh] = useEvents({
    month: shownMonth,
  });
  // Navigation
  const { navigate } = useNavigation();

  return (
    <View
      key={index}
      style={{ height: "100%", width: "100%" }}
      collapsable={false}
    >
      <ErrorBoundary>
        <EventListPage
          eventsByMonth={eventsByMonth}
          marked={markedDates as MarkedDates}
          refreshing={refreshing}
          refresh={refresh}
          month={shownMonth}
          tryToNavigate={(eventToNavigateTo, occurrenceUuid) =>
            navigate("Event", {
              event: eventToNavigateTo,
              occurrenceId: occurrenceUuid,
            })
          }
        />
      </ErrorBoundary>
    </View>
  );
};
