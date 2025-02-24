import "~/global.css";

import type { Theme } from "@react-navigation/native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Slot } from "expo-router";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as React from "react";
import { Platform } from "react-native";

import { UrqlContext } from "~/components/api/urql";
import { AuthProvider } from "~/components/auth/AuthProvider";
import { SplashScreen } from "~/components/loading/SplashScreen";
import useLoadFonts from "~/hooks/useLoadFonts";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { Logger } from "~/util/logger/Logger";

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

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <>
      <SplashScreen show={fontsLoaded}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <UrqlContext>
            <AuthProvider>
              <Slot />
            </AuthProvider>
          </UrqlContext>
        </ThemeProvider>
      </SplashScreen>
      <PortalHost />
    </>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
