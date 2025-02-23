import "@/css/global.css";

import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import { Stack } from "expo-router/stack";
import { useEffect } from "react";

import { UrqlContext } from "@/components/api/urql";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SplashScreen } from "@/components/loading/SplashScreen";
import useLoadFonts from "@/hooks/useLoadFonts";
import { Logger } from "@/util/logger/Logger";

export default function Layout() {
  useAsyncStorageDevTools();

  const [fontsLoaded, fontError] = useLoadFonts();

  useEffect(() => {
    if (fontError) {
      Logger.error("Failed to load fonts", { error: fontError });
    }
  }, [fontError]);

  return (
    <SplashScreen show={fontsLoaded}>
      <UrqlContext>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </UrqlContext>
    </SplashScreen>
  );
}
