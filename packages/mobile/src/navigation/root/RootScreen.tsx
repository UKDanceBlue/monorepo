import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DbRole } from "@ukdanceblue/common";
import { useTheme } from "native-base";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Alert, useWindowDimensions } from "react-native";
import { useQuery } from "urql";

import ErrorBoundary, {
  withErrorBoundary,
} from "@/common/components/ErrorBoundary";
import { Logger } from "@/common/logger/Logger";
import { graphql, readFragment } from "@/graphql/index";

import { useColorModeValue } from "../../common/customHooks";
import { useLoading } from "../../context";
import type { RootStackParamList } from "../../types/navigationTypes";
import HeaderIcons from "../HeaderIcons";
import EventScreen from "./EventScreen";
import { EventScreenFragment } from "./EventScreen/EventScreenFragment";
import SplashLogin from "./Modals/SplashLogin";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen, {
  ProfileScreenAuthFragment,
  ProfileScreenUserFragment,
} from "./ProfileScreen";
import TabBar from "./tab/TabBar";

// import HourScreen from "./tab/HoursScreen/HourScreen";

const RootScreenAuthFragment = graphql(/* GraphQL */ `
  fragment RootScreenAuthFragment on LoginState {
    dbRole
  }
`);
const rootScreenDocument = graphql(
  /* GraphQL */ `
    query RootScreenDocument {
      loginState {
        ...ProfileScreenAuthFragment
        ...RootScreenAuthFragment
      }
      me {
        ...ProfileScreenUserFragment
      }
    }
  `,
  [ProfileScreenAuthFragment, RootScreenAuthFragment, ProfileScreenUserFragment]
);

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootScreen = () => {
  const { fontScale } = useWindowDimensions();

  const [{ data: rootScreenData, fetching, error }] = useQuery({
    query: rootScreenDocument,
  });
  const [shownErrors, setShownErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (error && !shownErrors.has(String(error))) {
      Logger.error("Error fetching data for RootScreen", { error });
      setShownErrors((prev) => new Set([...prev, String(error)]));
      Alert.alert(
        "Error fetching data for RootScreen",
        error.networkError
          ? "Network error"
          : error.graphQLErrors.map((e) => e.message).join("\n")
      );
    }
  }, [error, shownErrors]);

  const [rootScreenLoading, setRootScreenLoading] = useLoading(
    "rootScreen-rootScreenDocument",
    10_000
  );

  useEffect(() => {
    if (fetching) {
      setRootScreenLoading(true);
    } else {
      setRootScreenLoading(false);
    }
  }, [fetching, setRootScreenLoading]);

  // const authData = readFragment(
  //   RootScreenAuthFragment,
  //   rootScreenData?.loginState ?? null
  // );
  // const isLoggedIn = useMemo(() => {
  //   return authData && authData.dbRole !== DbRole.None;
  // }, [authData]);
  const isLoggedIn = true;

  const { colors } = useTheme();
  const headerBgColor = useColorModeValue(colors.white, colors.gray[800]);
  const headerFgColor = useColorModeValue(colors.gray[800], colors.light[600]);

  return (
    <>
      {!rootScreenLoading && (
        <RootStack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: headerBgColor },
            headerTitleStyle: { color: headerFgColor },
            headerRight: HeaderIcons,
            headerBackTitle: "Back",
          }}
        >
          {isLoggedIn ? (
            <>
              <RootStack.Screen
                name="Tab"
                options={{ headerShown: false }}
                component={withErrorBoundary(TabBar)}
              />
              <RootStack.Screen
                name="Notifications"
                component={withErrorBoundary(NotificationScreen)}
                options={{ headerRight: () => undefined }}
              />
              <RootStack.Screen
                name="Profile"
                options={{ headerRight: () => undefined }}
              >
                {() => (
                  <ErrorBoundary>
                    <ProfileScreen
                      profileScreenAuthFragment={
                        rootScreenData?.loginState ?? null
                      }
                      profileScreenUserFragment={rootScreenData?.me ?? null}
                    />
                  </ErrorBoundary>
                )}
              </RootStack.Screen>
              <RootStack.Screen
                name="Event"
                component={withErrorBoundary(EventScreen)}
                options={({ route }) => {
                  let eventTitle = "Event";
                  let spacesInTitle = 0;
                  const eventData = readFragment(
                    EventScreenFragment,
                    route.params.event
                  );
                  if (eventData.title) {
                    eventTitle = eventData.title;
                    for (const char of eventTitle) {
                      if (char === " ") {
                        spacesInTitle++;
                      }
                    }
                  }
                  let titleWidth = eventTitle.length * fontScale;

                  // Safety precaution:
                  let loopCount = 0;

                  let hadToBreakWord = false;
                  if (titleWidth > 18) {
                    while (titleWidth > 18) {
                      if (spacesInTitle > 0) {
                        eventTitle = eventTitle
                          .split(" ")
                          .slice(0, -1)
                          .join(" ");
                        spacesInTitle--;
                      } else {
                        eventTitle = eventTitle.slice(0, -1);
                        hadToBreakWord = true;
                      }
                      titleWidth = eventTitle.length * fontScale;

                      if (++loopCount > 100) {
                        Logger.warn(
                          "Infinite loop detected while calculating title width for event screen."
                        );
                      }
                    }

                    if (hadToBreakWord) {
                      eventTitle = `${eventTitle}...`;
                    }
                  }

                  return {
                    title: eventTitle,
                    headerMode: "screen",
                    // headerRight: undefined,
                  };
                }}
              />
              {/* <RootStack.Screen name="Hour Details" component={HourScreen} /> */}
            </>
          ) : (
            <RootStack.Screen
              name="SplashLogin"
              component={withErrorBoundary(SplashLogin)}
              options={{
                headerShown: false,
                presentation: "modal",
                gestureEnabled: false,
              }}
            />
          )}
        </RootStack.Navigator>
      )}
    </>
  );
};

export default RootScreen;
