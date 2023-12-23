import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DbRole } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { Center, Text, useTheme } from "native-base";
import { useEffect, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useQuery } from "urql";

import { useColorModeValue } from "../../common/customHooks";
import { log } from "../../common/logging";
import { useLoading } from "../../context";
import type { RootStackParamList } from "../../types/navigationTypes";
import HeaderIcons from "../HeaderIcons";

import EventScreen from "./EventScreen";
import { EventScreenFragment } from "./EventScreen/EventScreenFragment";
import SplashLogin from "./Modals/SplashLogin";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import TabBar from "./tab/TabBar";

// import HourScreen from "./tab/HoursScreen/HourScreen";

const rootScreenDocument = graphql(/* GraphQL */ `
  query RootScreenDocument {
    loginState {
      ...ProfileScreenAuthFragment
      ...RootScreenAuthFragment
    }
    me {
      data {
        ...ProfileScreenUserFragment
      }
    }
  }
`);

const RootScreenAuthFragment = graphql(/* GraphQL */ `
  fragment RootScreenAuthFragment on LoginState {
    role {
      dbRole
    }
  }
`);

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootScreen = () => {
  const { fontScale } = useWindowDimensions();

  const [{ data: rootScreenData, fetching, error }] = useQuery({
    query: rootScreenDocument,
  });

  const [rootScreenLoading, setRootScreenLoading] = useLoading(
    "rootScreen-rootScreenDocument"
  );
  useEffect(() => {
    if (fetching) {
      setRootScreenLoading(true);
    } else {
      setRootScreenLoading(false);
    }
  }, [fetching, setRootScreenLoading]);

  const authData = getFragmentData(
    RootScreenAuthFragment,
    rootScreenData?.loginState ?? null
  );
  const isLoggedIn = useMemo(() => {
    return authData?.role.dbRole !== DbRole.None;
  }, [authData]);

  const { colors } = useTheme();
  const headerBgColor = useColorModeValue(colors.white, colors.gray[800]);
  const headerFgColor = useColorModeValue(colors.gray[800], colors.light[600]);

  return (
    <>
      {error != null && (
        <Center>
          {console.error(error)}
          <Text>Error: {error.message}</Text>
        </Center>
      )}
      {!rootScreenLoading && (
        <RootStack.Navigator
          screenOptions={({
            navigation,
          }: {
            navigation: NativeStackNavigationProp<RootStackParamList>;
          }) => ({
            headerStyle: { backgroundColor: headerBgColor },
            headerTitleStyle: { color: headerFgColor },
            headerRight: () => (
              <HeaderIcons navigation={navigation} /* color={headerFgColor}*/ />
            ),
            headerBackTitle: "Back",
          })}
        >
          {isLoggedIn ? (
            <>
              <RootStack.Screen
                name="Tab"
                options={{ headerShown: false }}
                component={TabBar}
              />
              <RootStack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{ headerRight: () => undefined }}
              />
              <RootStack.Screen
                name="Profile"
                options={{ headerRight: () => undefined }}
              >
                {() => (
                  <ProfileScreen
                    profileScreenAuthFragment={
                      rootScreenData?.loginState ?? null
                    }
                    profileScreenUserFragment={rootScreenData?.me.data ?? null}
                  />
                )}
              </RootStack.Screen>
              <RootStack.Screen
                name="Event"
                component={EventScreen}
                options={({ route }) => {
                  let eventTitle = "Event";
                  let spacesInTitle = 0;
                  const eventData = getFragmentData(
                    EventScreenFragment,
                    route.params.event
                  );
                  if (eventData.title) {
                    eventTitle = eventData.title;
                    for (let i = 0; i < eventTitle.length; i++) {
                      if (eventTitle[i] === " ") {
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
                        log(
                          "Infinite loop detected while calculating title width for event screen.",
                          "warn"
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
              component={SplashLogin}
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
