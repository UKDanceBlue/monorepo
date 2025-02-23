import { Stack } from "expo-router/stack";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { RneThemeProvider } from "@/theme/rne";

export default function Layout() {
  return (
    <RneThemeProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </RneThemeProvider>
  );
}
