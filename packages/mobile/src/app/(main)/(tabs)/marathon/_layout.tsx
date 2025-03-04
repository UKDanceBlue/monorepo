import { Stack } from "expo-router";

export default function MarathonLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[hour]/index" options={{}} />
    </Stack>
  );
}
