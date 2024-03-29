// Import third-party dependencies
import ErrorBoundary from "@common/components/ErrorBoundary";
import { useUpdateChecker } from "@common/hooks/useUpdateChecker";
import { logError, universalCatch } from "@common/logging";
import { showMessage } from "@common/util/alertUtils";
import { UrqlContext } from "@context/urql";
import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import { hideAsync } from "expo-splash-screen";
// TODO: Switch away from native-base https://nativebase.io/blogs/road-ahead-with-gluestack-ui
import { isEmergencyLaunch } from "expo-updates";
import type { ICustomTheme } from "native-base";
import { NativeBaseProvider } from "native-base";
import { useEffect, useRef, useState } from "react";

import BoldoniFlfBoldItalicFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold-Italic.ttf";
import BoldoniFlfBoldFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold.ttf";
import BoldoniFlfItalicFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Italic.ttf";
import BoldoniFlfRomanFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Roman.ttf";
import OpenSansCondensedBoldFont from "./assets/fonts/opensans-condensed/OpenSans-Condensed-Bold.ttf";
import OpenSansCondensedLightItalicFont from "./assets/fonts/opensans-condensed/OpenSans-Condensed-Light-Italic.ttf";
import OpenSansCondensedLightFont from "./assets/fonts/opensans-condensed/OpenSans-Condensed-Light.ttf";
import { CombinedContext } from "./src/context";
import { FilledNavigationContainer } from "./src/navigation/NavigationContainer";
import { getCustomTheme } from "./src/theme";

if (isEmergencyLaunch) {
  alert(
    "A CRITICAL ERROR HAS OCCURRED!\nYou are running a fallback version of the app and will likely experience issues. Please try to restart the app to fix this issue. If the issue persists, please contact the Tech Committee."
  );
}

/**
 * Main app container
 */
const App = () => {
  const isOfflineInternal = useRef(false);
  const [theme, setTheme] = useState<ICustomTheme | undefined>(undefined);

  useAsyncStorageDevTools();

  const [fontsLoaded, error] = useFonts({
    "bodoni-flf-bold": BoldoniFlfBoldFont,
    "bodoni-flf-bold-italic": BoldoniFlfBoldItalicFont,
    "bodoni-flf-italic": BoldoniFlfItalicFont,
    "bodoni-flf-roman": BoldoniFlfRomanFont,
    "opensans-condensed-bold": OpenSansCondensedBoldFont,
    "opensans-condensed-light": OpenSansCondensedLightFont,
    "opensans-condensed-light-italic": OpenSansCondensedLightItalicFont,
  });

  useEffect(() => {
    if (error) {
      logError(error);
    }
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      hideAsync().catch(universalCatch);
      // Have to get the theme AFTER fonts are loaded
      setTheme(getCustomTheme());
    }
  }, [fontsLoaded]);

  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        if (!state.isConnected && !isOfflineInternal.current) {
          isOfflineInternal.current = true;
          showMessage(
            "You seem to be offline, some functionality may be unavailable or out of date"
          );
          // Store.dispatch(appConfigSlice.actions.goOffline()); TODO Reimplement
        } else if (isOfflineInternal.current) {
          isOfflineInternal.current = false;
        }
      }),
    []
  );

  useUpdateChecker();

  return (
    fontsLoaded &&
    theme && (
      <NativeBaseProvider
        config={{ strictMode: __DEV__ ? "error" : "off" }}
        theme={theme}
      >
        <ErrorBoundary>
          <UrqlContext>
            <CombinedContext>
              <FilledNavigationContainer />
            </CombinedContext>
          </UrqlContext>
        </ErrorBoundary>
      </NativeBaseProvider>
    )
  );
};

function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWrapper;
