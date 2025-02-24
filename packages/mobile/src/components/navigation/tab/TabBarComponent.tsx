import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import React from "react";
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { FontAwesome } from "~/lib/icons/FontAwesome";
import BackgroundCutout from "~/svgs/background-cutout";
import DanceBlueRibbon from "~/svgs/DBRibbon";

// From https://reactnavigation.org/docs/bottom-tab-navigator#tabbar

const iconMap = {
  // https://icons.expo.fyi/
  // Key: Screen   Value: Icon ID
  "Home": "home",
  "Events": "calendar",
  "Explore": "compass",
  "Store": "store",
  "More": "ellipsis-h",
  "Scoreboard": "list-ol",
  "Teams": "users",
  "Donate": "hand-holding-heart",
  "Marathon": "people-arrows",
  "Scavenger Hunt": "search",
  "Logo": null,
  "Morale Cup": "trophy",
  "Info": "info-circle",
  "DB Moments": "camera-retro",
};

function TabBarIcon({
  isFocused,
  options,
  onPress,
  onLongPress,
  isFancy: isMiddle,
  iconSize,
  label,
  iconKey,
}: {
  isFocused: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  onLongPress: () => void;
  isFancy?: boolean;
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
          <FontAwesome
            name={iconMap[iconKey]}
            size={iconSize}
            className={`${isFocused ? "color-white" : "color-gray-400"} text-xs`}
          />
        )}
        {label && (
          <Text
            className={`${isFocused ? "color-white" : "color-gray-400"} text-xs`}
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
  route,
  options,
  navigation,
  tabBarHeight,
  isFancyTab,
}: {
  label: string;
  isFocused: boolean;
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
  fancyTab,
}: BottomTabBarProps & { fancyTab: string | undefined }) {
  const { width: screenWidth } = useWindowDimensions();

  const tabBarHeight = screenWidth / 8;

  const fancyTabIdx = fancyTab
    ? state.routes.findIndex(({ name }) => name === fancyTab)
    : null;

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
            {fancyTabIdx !== null && (
              <TabBarEntry
                label="DanceBlue"
                isFocused={state.index === fancyTabIdx}
                route={state.routes[fancyTabIdx]}
                options={descriptors[state.routes[fancyTabIdx].key].options}
                navigation={navigation}
                tabBarHeight={tabBarHeight}
                screenWidth={screenWidth}
                isFancyTab
              />
            )}
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
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            if (index === fancyTabIdx) {
              return <View key={route.key} />;
            }
            return (
              <TabBarEntry
                key={route.key}
                route={route}
                label={
                  typeof options.tabBarLabel === "string"
                    ? options.tabBarLabel
                    : (options.title ?? route.name)
                }
                isFocused={state.index === index}
                options={options}
                navigation={navigation}
                tabBarHeight={tabBarHeight}
                screenWidth={screenWidth}
                isFancyTab={false}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default TabBarComponent;
