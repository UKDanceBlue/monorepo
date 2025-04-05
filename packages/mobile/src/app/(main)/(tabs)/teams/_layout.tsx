import { Stack } from "expo-router/stack";

export default function TeamsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="fundraising" options={{}} />
      <Stack.Screen name="[team]/index" options={{}} />
    </Stack>
  );
}
