import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import _ from "lodash";
import React from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { useTabBarConfig } from "~/api/hooks/useTabBarConfig";
import { FontAwesome5 } from "~/lib/icons/FontAwesome5";
import BackgroundCutout from "~/svgs/background-cutout";
import DanceBlueRibbon from "~/svgs/DBRibbon";

// From https://reactnavigation.org/docs/bottom-tab-navigator#tabbar

const iconMap = {
  // https://icons.expo.fyi/
  // Key: Screen   Value: Icon ID
  index: "home",
  events: "calendar",
  explore: "compass",
  teams: "users",
  marathon: "people-arrows",
  Logo: null,
  dbmoments: "camera-retro",
} as const;

function TabBarIcon({
  isFocused,
  options,
  onPress,
  onLongPress,
  isFancy: isMiddle,
  focusedClass,
  iconSize,
  label,
  iconKey,
}: {
  isFocused: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  onLongPress: () => void;
  isFancy?: boolean;
  focusedClass: string;
  iconSize: number;
  label?: string;
  iconKey: keyof typeof iconMap;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      className={`flex-1 ${isMiddle ? "bg-primary-600" : ""}`}
    >
      <View className="flex items-center justify-center flex-1">
        {iconKey === "Logo" ? (
          <DanceBlueRibbon svgProps={{ width: iconSize, height: iconSize }} />
        ) : (
          <FontAwesome5
            name={iconMap[iconKey]}
            size={iconSize}
            className={isFocused ? focusedClass : "color-gray-400"}
          />
        )}
        {label && (
          <Text
            className={`${isFocused ? focusedClass : "color-gray-400"} text-xs`}
          >
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function TabBarEntry({
  label,
  isFocused,
  focusedClass,
  route,
  options,
  navigation,
  tabBarHeight,
  isFancyTab,
}: {
  label: string;
  isFocused: boolean;
  focusedClass: string;
  route: TabNavigationState<ParamListBase>["routes"][number];
  options: BottomTabNavigationOptions;
  navigation: BottomTabBarProps["navigation"];
  tabBarHeight: number;
  screenWidth: number;
  isFancyTab: boolean;
}) {
  const sizeOfIcon = tabBarHeight * 0.32;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({ name: route.name, merge: true, params: {} });
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  };

  return (
    <TabBarIcon
      key={route.key}
      isFocused={isFocused}
      focusedClass={focusedClass}
      options={options}
      onPress={onPress}
      onLongPress={onLongPress}
      isFancy={isFancyTab}
      iconSize={isFancyTab ? tabBarHeight * 0.8 : sizeOfIcon}
      iconKey={isFancyTab ? "Logo" : (route.name as keyof typeof iconMap)}
      label={isFancyTab ? undefined : label}
    />
  );
}

function TabBarComponent({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { shownTabs, fancyTab, tabConfigLoading } = useTabBarConfig();

  const { width: screenWidth } = useWindowDimensions();

  const tabBarHeight = Math.min(screenWidth / 6, 120);

  if (tabConfigLoading) {
    return null;
  }

  const fancyTabIdx = state.routes.findIndex(
    (r) => r.name === fancyTab || descriptors[r.key].options.title === fancyTab
  );

  const tabs = state.routes
    .map((route, index) => {
      const { options } = descriptors[route.key];
      return [
        route,
        <TabBarEntry
          key={route.key}
          route={route}
          label={
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : (options.title ?? route.name)
          }
          isFocused={state.index === index}
          focusedClass={fancyTabIdx !== -1 ? "color-white" : "color-primary"}
          options={options}
          navigation={navigation}
          tabBarHeight={tabBarHeight}
          screenWidth={screenWidth}
          isFancyTab={false}
        />,
      ] as const;
    })
    .filter(
      ([route], idx) =>
        idx !== fancyTabIdx &&
        (shownTabs
          .map((s) => s.toLowerCase())
          .includes(descriptors[route.key].options.title!.toLowerCase()) ||
          // Special case for explore
          (descriptors[route.key].options.title === "Explore" &&
            shownTabs.includes("Explorer")))
    )
    .map(([, tab]) => tab);

  if (fancyTab) {
    const middle = Math.floor(tabs.length / 2);
    tabs.splice(middle, 0, <View key="placeholder" className="flex-1" />);
  }

  return (
    <View
      // height={tabBarHeight}
      // width={screenWidth}
      style={{
        height: tabBarHeight,
        width: screenWidth,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        // borderTopColor: navTheme.colors.border,
        borderTopWidth: fancyTab ? 0 : 2,
      }}
      className="border-t-border"
    >
      <View className="absolute inset-0">
        {!!fancyTab && (
          <BackgroundCutout
            // svgProps={{ width: screenWidth, height: tabBarHeight }}
            width={screenWidth}
            height={tabBarHeight}
            color="#0032A0"
          >
            <TabBarEntry
              label="DanceBlue"
              isFocused={state.index === fancyTabIdx}
              focusedClass=""
              route={state.routes[fancyTabIdx]}
              options={descriptors[state.routes[fancyTabIdx].key].options}
              navigation={navigation}
              tabBarHeight={tabBarHeight}
              screenWidth={screenWidth}
              isFancyTab
            />
          </BackgroundCutout>
        )}
      </View>
      <View className="absolute inset-0">
        <View
          style={{
            flexDirection: "row",
            width: screenWidth,
            height: tabBarHeight,
          }}
        >
          {tabs}
        </View>
      </View>
    </View>
  );
}

export default TabBarComponent;
