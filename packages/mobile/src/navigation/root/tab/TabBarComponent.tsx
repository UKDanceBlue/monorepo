import { FontAwesome5 } from "@expo/vector-icons";
import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { Box, useTheme, View, VStack, ZStack } from "native-base";
import React from "react";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";

import { useColorModeValue, useThemeColors } from "@/common/customHooks";
import { colors } from "@/theme/colors";

import BackgroundCutout from "../../../../assets/screens/navigation/background-cutout";
import DanceBlueRibbon from "../../../common/components/svgs/DBRibbon";
import { useReactNavigationTheme } from "../../../theme";

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

const tabBarIcon = ({
  color,
  size,
  iconKey: routeName,
}: {
  color: string;
  size: number;
  iconKey: keyof typeof iconMap;
}) => {
  if (routeName === "Logo") {
    return <DanceBlueRibbon svgProps={{ width: size, height: size }} />;
  } else {
    return (
      <FontAwesome5
        name={iconMap[routeName]}
        size={size}
        color={color}
        style={{ textAlignVertical: "center" }}
      />
    );
  }
};

function TabBarIcon({
  isFocused,
  options,
  onPress,
  onLongPress,
  sizeFactor,
  isFancy: isMiddle,
  iconSize,
  label,
  iconKey,
}: {
  isFocused: boolean;
  options: BottomTabNavigationOptions;
  onPress: () => void;
  onLongPress: () => void;
  sizeFactor: number;
  isFancy?: boolean;
  iconSize: number;
  label?: string;
  iconKey: keyof typeof iconMap;
}) {
  const navTheme = useReactNavigationTheme();
  const theme = useTheme();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        width: sizeFactor,
        height: sizeFactor,
        borderRadius: sizeFactor,
        backgroundColor: isMiddle ? colors.primary?.[600] : undefined,
      }}
    >
      <VStack alignItems="center" justifyContent="center" flex={1}>
        {tabBarIcon({
          color: isFocused ? navTheme.colors.primary : navTheme.colors.text,
          size: iconSize,
          iconKey,
        })}
        {label && (
          <Text
            style={{
              color: isFocused ? navTheme.colors.primary : navTheme.colors.text,
              fontSize: theme.fontSizes.xs,
            }}
          >
            {label}
          </Text>
        )}
      </VStack>
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
  screenWidth,
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

  return isFancyTab ? (
    <>
      <View
        key={route.key}
        style={{
          position: "absolute",
          width: screenWidth,
          height: screenWidth * 0.1 * 1.4,
          bottom: Math.trunc(tabBarHeight * 0.5),
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
        pointerEvents="box-none"
      >
        <TabBarIcon
          isFocused={isFocused}
          options={options}
          onPress={onPress}
          onLongPress={onLongPress}
          sizeFactor={tabBarHeight * 0.8}
          isFancy
          iconSize={tabBarHeight * 0.8}
          iconKey="Logo"
        />
      </View>
      <View
        style={{ width: screenWidth * 0.2 }}
        collapsable={false}
        pointerEvents="none"
      />
    </>
  ) : (
    <TabBarIcon
      key={route.key}
      isFocused={isFocused}
      options={options}
      onPress={onPress}
      onLongPress={onLongPress}
      sizeFactor={tabBarHeight * 0.8}
      iconSize={sizeOfIcon}
      label={label}
      iconKey={route.name as keyof typeof iconMap}
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
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const navTheme = useReactNavigationTheme();

  const tabBarHeight = screenHeight * 0.1;

  const { dark } = useThemeColors();
  const tabBarBackgroundColor = useColorModeValue("#e0edff", dark[100]);

  return (
    <Box
      height={tabBarHeight}
      width={screenWidth}
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        borderTopColor: navTheme.colors.border,
        borderTopWidth: fancyTab ? 0 : 2,
      }}
    >
      <ZStack>
        {!!fancyTab && (
          <BackgroundCutout
            svgProps={{ width: screenWidth, height: tabBarHeight }}
            color={tabBarBackgroundColor}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            width: screenWidth,
            height: tabBarHeight,
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
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
                isFancyTab={route.name === fancyTab}
              />
            );
          })}
        </View>
      </ZStack>
    </Box>
  );
}

export default TabBarComponent;
