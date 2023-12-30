import { useNavigation } from "@react-navigation/native";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import type { InfinitePagerPageComponent } from "react-native-infinite-pager";
import InfinitePager from "react-native-infinite-pager";

import { EventListPage } from "./EventListPage";
import { useEvents } from "./eventListUtils";

// const DummyView = (
//   <View
//     onStartShouldSetResponder={() => true}
//     onTouchEnd={(e) => {
//       e.stopPropagation();
//     }}
//   >
//     <EventListPage
//       eventsByMonth={{}}
//       marked={{}}
//       refreshing={true}
//       refresh={() => Promise.resolve()}
//       month={DateTime.now()}
//       tryToNavigate={() => undefined}
//       disabled
//     />
//   </View>
// );

const EventListScreen = () => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setTimeout(() => {
        setIsFirstRender(false);
      }, 0);
    }
  }, [isFirstRender]);

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
      <InfinitePager
        pageBuffer={1}
        style={{ height: "100%", width: "100%" }}
        initialIndex={0}
        PageComponent={EventListScreenPage}
        debugTag="EventListScreen"
      />
    </SafeAreaView>
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
      <EventListPage
        eventsByMonth={eventsByMonth}
        marked={markedDates}
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
    </View>
  );
};
