import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, useTheme } from "native-base";
import { useWindowDimensions } from "react-native";

import { useColorModeValue } from "../../common/customHooks";
import { log } from "../../common/logging";
import { useAuthData } from "../../context";
import { RootStackParamList } from "../../types/navigationTypes";
import HeaderIcons from "../HeaderIcons";

import EventScreen from "./EventScreen";
import SplashLogin from "./Modals/SplashLogin";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
// import HourScreen from "./tab/HoursScreen/HourScreen";
import TabBar from "./tab/TabBar";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootScreen = () => {
  const { fontScale } = useWindowDimensions();
  const {
    isAuthLoaded, isLoggedIn
  } = useAuthData();

  const { colors } = useTheme();
  const headerBgColor = useColorModeValue(colors.white, colors.gray[800]);
  const headerFgColor = useColorModeValue(colors.gray[800], colors.light[600]);

  return (
    <>
      {isAuthLoaded && (
        <RootStack.Navigator
          screenOptions={({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) => ({
            headerStyle: { backgroundColor: headerBgColor },
            headerTitleStyle: { color: headerFgColor },
            headerRight: () => <HeaderIcons navigation={navigation} color={headerFgColor} />,
            headerBackTitle: "Back",
          })}>
          {isLoggedIn ? (
            <>
              <RootStack.Screen name="Tab" options={{ headerShown: false }} component={TabBar} />
              <RootStack.Screen
                name="Notifications"
                component={NotificationScreen}
                options={{ headerRight: undefined }}
              />
              <RootStack.Screen name="Profile" component={ProfileScreen} options={{ headerRight: undefined }} />
              <RootStack.Screen
                name="Event"
                component={EventScreen}
                options={({ route }) => {
                  let title = "Event";
                  let spacesInTitle = 0;
                  if (route.params.event.name) {
                    title = route.params.event.name;
                    for (let i = 0; i < title.length; i++) {
                      if (title[i] === " ") {
                        spacesInTitle++;
                      }
                    }
                  }
                  let titleWidth = title.length * fontScale;

                  // Safety precaution:
                  let loopCount = 0;

                  let hadToBreakWord = false;
                  if (titleWidth > 18) {
                    while (titleWidth > 18) {
                      if (spacesInTitle > 0) {
                        title = title.split(" ").slice(0, -1).join(" ");
                        spacesInTitle--;
                      } else {
                        title = title.slice(0, -1);
                        hadToBreakWord = true;
                      }
                      titleWidth = title.length * fontScale;

                      if (++loopCount > 100) {
                        log("Infinite loop detected while calculating title width for event screen.", "warn");
                      }
                    }

                    if (hadToBreakWord) {
                      title = `${title }...`;
                    }
                  }

                  return ({
                    title,
                    headerMode: "screen",
                  // headerRight: undefined,
                  });
                }}
              />
              {/* <RootStack.Screen name="Hour Details" component={HourScreen} /> */}
            </>
          ) : (
            <RootStack.Screen
              name="SplashLogin"
              component={SplashLogin}
              options={{ headerShown: false, presentation: "modal", gestureEnabled: false }}
            />
          )}
        </RootStack.Navigator>
      )}
    </>
  );
};

export default RootScreen;
