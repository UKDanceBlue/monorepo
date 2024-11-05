import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { withErrorBoundary } from "#common/components/ErrorBoundary";
import { useTabBarConfig } from "#common/hooks/useTabBarConfig";

import type {
  RootStackParamList,
  TabNavigatorParamList,
} from "../../../types/navigationTypes";
import HeaderIcons from "../../HeaderIcons";
import { DBHeaderText } from "./DBHeaderText";
import DBMomentsScreen from "./DBMoments";
import EventListScreen from "./EventListScreen";
import ExplorerScreen from "./ExplorerScreen";
import HomeScreen from "./HomeScreen";
import InfoScreen from "./InfoScreen";
import MarathonScreen from "./MarathonScreen";
import SpiritScreen from "./spirit/SpiritStack";
import TabBarComponent from "./TabBarComponent";

const Tabs = createBottomTabNavigator<TabNavigatorParamList>();

const possibleTabs = {
  Home: (
    <Tabs.Screen
      key="Home"
      name="Home"
      component={withErrorBoundary(HomeScreen)}
    />
  ),
  Events: (
    <Tabs.Screen
      key="Events"
      name="Events"
      component={withErrorBoundary(EventListScreen)}
    />
  ),
  Explorer: (
    <Tabs.Screen
      key="Explore"
      name="Explore"
      component={withErrorBoundary(ExplorerScreen)}
    />
  ),
  Teams: (
    <Tabs.Screen
      key="Spirit"
      name="Teams"
      component={withErrorBoundary(SpiritScreen)}
    />
  ),
  Marathon: (
    <Tabs.Screen
      key="MarathonScreen"
      name="Marathon"
      component={withErrorBoundary(MarathonScreen)}
    />
  ),
  DBMoments: (
    <Tabs.Screen
      key="DBMoments"
      name="DB Moments"
      component={withErrorBoundary(DBMomentsScreen)}
    />
  ),
  Info: (
    <Tabs.Screen
      key="Info"
      name="Info"
      component={withErrorBoundary(InfoScreen)}
    />
  ),
} as const;

const TabBar = () => {
  const {
    tabConfigLoading,
    shownTabs: allEnabledScreens,
    fancyTab,
    forceAll,
  } = useTabBarConfig();

  const [currentTabs, setCurrentTabs] = useState<ReactElement[]>([]);

  useEffect(() => {
    if (!tabConfigLoading) {
      if (forceAll) {
        setCurrentTabs(Object.values(possibleTabs));
        return;
      } else if (allEnabledScreens.length === 0) {
        setCurrentTabs([possibleTabs.Home]);
        return;
      } else {
        let tempCurrentTabs = [];

        const enabledScreens = allEnabledScreens.filter(
          (screen) => screen !== fancyTab
        );

        for (const enabledScreen of enabledScreens) {
          if (enabledScreen !== fancyTab) {
            tempCurrentTabs.push(
              possibleTabs[enabledScreen as keyof typeof possibleTabs]
            );
          }
        }

        // if there is a fancy tab, add it to the middle
        if (fancyTab != null) {
          const middleIndex = Math.floor(tempCurrentTabs.length / 2);
          const fancyTabElement =
            possibleTabs[fancyTab as keyof typeof possibleTabs];
          const firstHalf = tempCurrentTabs.slice(0, middleIndex);
          const secondHalf = tempCurrentTabs.slice(middleIndex);
          tempCurrentTabs = [...firstHalf, fancyTabElement, ...secondHalf];
        }

        setCurrentTabs(tempCurrentTabs);
        // log(
        //   `Config loaded, setting current tabs to ${JSON.stringify({
        //     currentTabs: tempCurrentTabs,
        //   })}`
        // );
      }
    }
  }, [allEnabledScreens, fancyTab, forceAll, tabConfigLoading]);

  return (
    <Tabs.Navigator
      screenOptions={({
        navigation,
      }: {
        navigation: NativeStackNavigationProp<RootStackParamList>;
        route: RouteProp<TabNavigatorParamList>;
      }) => ({
        // tabBarBackground: () => (
        //   <Image
        //     source={require("../../../../assets/screens/navigation/standardBG.png") as ImageSourcePropType}
        //     alt="Navigation Background Image"
        //     width={width}
        //     height={130}/>
        // ),
        headerLeft: DBHeaderText,
        headerTitle: () => null,
        headerRight: () => <HeaderIcons navigation={navigation} />,
        headerStyle: [
          {
            borderBottomWidth: 1.5,
            borderBottomColor: "#0032A0",
            borderStyle: "solid",
            shadowOffset: {
              width: 0,
              height: -5,
            },
            shadowRadius: 5,
            shadowOpacity: 0.5,
            shadowColor: "#0032A0",
          },
          null,
        ],
      })}
      tabBar={(props) => <TabBarComponent {...props} fancyTab={fancyTab} />}
    >
      {!tabConfigLoading && currentTabs.length > 0
        ? currentTabs
        : [possibleTabs.Home]}
    </Tabs.Navigator>
  );
};

export default TabBar;
