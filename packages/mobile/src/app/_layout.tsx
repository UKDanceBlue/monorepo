import "~/global.css";

import { useLogger } from "@react-navigation/devtools";
import type { Theme } from "@react-navigation/native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Slot, useNavigationContainerRef } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { useEffect } from "react";
import * as React from "react";
import { Platform } from "react-native";

import { UrqlContext } from "~/api/context/urql";
import { AuthProvider } from "~/auth/context/AuthProvider";
import { SplashScreen } from "~/components/loading/SplashScreen";
import { NAV_THEME } from "~/lib/constants";
import useLoadFonts from "~/lib/hooks/useLoadFonts";
import { Logger } from "~/lib/logger/Logger";
import { useColorScheme } from "~/lib/useColorScheme";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from "expo-router";

export default function Layout() {
  const hasMounted = React.useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  const [fontsLoaded, fontError] = useLoadFonts();

  useEffect(() => {
    if (fontError) {
      Logger.error("Failed to load fonts", { error: fontError });
    }
  }, [fontError]);

  useLogger(useNavigationContainerRef());

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <React.StrictMode>
      <SplashScreen show={fontsLoaded}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <AuthProvider>
            <UrqlContext>
              <NativeBaseProvider>
                <Slot />
              </NativeBaseProvider>
            </UrqlContext>
          </AuthProvider>
        </ThemeProvider>
      </SplashScreen>
      <PortalHost />
    </React.StrictMode>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
