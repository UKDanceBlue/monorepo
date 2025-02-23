import { Stack } from "expo-router/stack";

export default function TeamsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="fundraising" options={{}} />
      <Stack.Screen name="[team]/index" options={{}} />
    </Stack>
  );
}
