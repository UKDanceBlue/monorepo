import { Stack } from "expo-router/stack";
import { verifyInstallation } from "nativewind";

import { useAuthContext } from "~/auth/context/AuthContext";

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
        options={{
          title: "Profile",
          presentation: "fullScreenModal",
          animation: "slide_from_right",
        }}
        redirect={showLogin}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          presentation: "fullScreenModal",
          animation: "slide_from_right",
        }}
        redirect={showLogin}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
