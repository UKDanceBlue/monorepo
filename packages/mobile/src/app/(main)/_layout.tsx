import { Stack } from "expo-router/stack";
import { verifyInstallation } from "nativewind";

import { useAuthContext } from "~/components/auth/AuthContext";

export default function Layout() {
  const showLogin = useAuthContext().token == null;

  verifyInstallation();

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
        redirect={showLogin}
      />
      <Stack.Screen
        name="profile"
        options={{ title: "Profile" }}
        redirect={showLogin}
      />
      <Stack.Screen
        name="notifications"
        options={{ title: "Notifications" }}
        redirect={showLogin}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="test" options={{ title: "Test" }} />
    </Stack>
  );
}
