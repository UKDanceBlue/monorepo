import { useTabBarConfig } from "@common/hooks/useTabBarConfig";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import type {
  RootStackParamList,
  TabNavigatorParamList,
} from "../../../types/navigationTypes";
import HeaderIcons from "../../HeaderIcons";

import { DBHeaderText } from "./DBHeaderText";
import DBMomentsScreen from "./DBMoments";
import EventListScreen from "./EventListScreen";
import HomeScreen from "./HomeScreen";
import MarathonScreen from "./MarathonScreen";
import MoraleCup from "./MoraleCup";
import TabBarComponent from "./TabBarComponent";
import SpiritScreen from "./spirit/SpiritStack";

const Tabs = createBottomTabNavigator<TabNavigatorParamList>();

export const possibleTabs = {
  Events: (
    <Tabs.Screen key="Events" name="Events" component={EventListScreen} />
  ),
  Teams: <Tabs.Screen key="Spirit" name="Teams" component={SpiritScreen} />,
  Marathon: (
    <Tabs.Screen
      key="MarathonScreen"
      name="Marathon"
      component={MarathonScreen}
    />
  ),
  DBMoments: (
    <Tabs.Screen
      key="DBMoments"
      name="DB Moments"
      component={DBMomentsScreen}
    />
  ),
  MoraleCup: (
    <Tabs.Screen key="MoraleCup" name="Morale Cup" component={MoraleCup} />
  ),
} as const;

const TabBar = () => {
  const {
    tabConfigLoading,
    shownTabs: allEnabledScreens,
    fancyTab,
  } = useTabBarConfig();

  const [currentTabs, setCurrentTabs] = useState<ReactElement[]>([]);

  useEffect(() => {
    if (!tabConfigLoading) {
      let tempCurrentTabs = [];

      const enabledScreens = allEnabledScreens.filter(
        (screen) => screen !== fancyTab
      );

      for (let i = 0; i < enabledScreens.length; i++) {
        if (enabledScreens[i] !== fancyTab) {
          tempCurrentTabs.push(
            possibleTabs[enabledScreens[i] as keyof typeof possibleTabs]
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

      tempCurrentTabs.push(possibleTabs["DBMoments"]);

      setCurrentTabs(tempCurrentTabs);
      // log(
      //   `Config loaded, setting current tabs to ${JSON.stringify({
      //     currentTabs: tempCurrentTabs,
      //   })}`
      // );
    }
  }, [allEnabledScreens, fancyTab, tabConfigLoading]);

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
      <Tabs.Screen name="Home" component={HomeScreen} />
      {!tabConfigLoading && currentTabs}
    </Tabs.Navigator>
  );
};

export default TabBar;
