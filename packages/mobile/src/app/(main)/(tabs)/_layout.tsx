import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import { DBHeaderText } from "@/components/navigation/header/DBHeaderText";
import HeaderIcons from "@/components/navigation/header/HeaderIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerRight: HeaderIcons,
        headerLeft: DBHeaderText,
        headerTitle: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dbmoments"
        options={{
          title: "DB Moments",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="camera" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: "Teams",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="users" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marathon"
        options={{
          title: "Marathon",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="calendar" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
