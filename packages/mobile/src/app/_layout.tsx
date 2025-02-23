import { Stack } from "expo-router/stack";

import { RneThemeProvider } from "@/theme/rne";

export default function Layout() {
  return (
    <RneThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen
          name="notifications"
          options={{ title: "Notifications" }}
        />
        <Stack.Screen name="test" options={{ title: "Test" }} />
      </Stack>
    </RneThemeProvider>
  );
}
