// Import third-party dependencies
import ErrorBoundary from "@common/components/ErrorBoundary";
import { logError, universalCatch } from "@common/logging";
import { showMessage } from "@common/util/alertUtils";
import { UrqlContext } from "@context/urql";
import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import { hideAsync } from "expo-splash-screen";
// import {
//   UpdateEventType,
//   addListener as addUpdateListener,
//   checkForUpdateAsync,
//   fetchUpdateAsync,
//   reloadAsync,
// } from "expo-updates";
// TODO: Switch away from native-base https://nativebase.io/blogs/road-ahead-with-gluestack-ui
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
import "./src/common/util/AndroidTimerFix"; // https://github.com/firebase/firebase-js-sdk/issues/97#issuecomment-427512040
import { CombinedContext } from "./src/context";
import { FilledNavigationContainer } from "./src/navigation/NavigationContainer";
import { getCustomTheme } from "./src/theme";

/**
 * Main app container
 */
const App = () => {
  const isOfflineInternal = useRef(false);
  const [theme, setTheme] = useState<ICustomTheme | undefined>(undefined);

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

  // useEffect(() => {
  //   // TODO: Switch to https://github.com/expo/custom-expo-updates-server
  //   if (!__DEV__) {
  //     const updatesSubscription = addUpdateListener(({ type, message }) => {
  //       if (type === UpdateEventType.UPDATE_AVAILABLE) {
  //         showPrompt(
  //           "Updated data for the DanceBlue app is available, reload the app now?",
  //           "New Content Available",
  //           undefined,
  //           () => {
  //             reloadAsync().catch(universalCatch);
  //           },
  //           "Later",
  //           "Yes"
  //         );
  //       } else if (type === UpdateEventType.ERROR) {
  //         log(`Expo-Updates error: ${message ?? "[UNKNOWN]"}`, "warn");
  //       }
  //     }) as EventSubscription;

  //     const listener = AppState.addEventListener("change", (nextAppState) => {
  //       if (nextAppState === "active") {
  //         checkForUpdateAsync()
  //           .then(async ({ isAvailable }) => {
  //             if (isAvailable) {
  //               await fetchUpdateAsync();
  //             }
  //           })
  //           .catch(universalCatch);
  //       }
  //     });

  //     return () => {
  //       updatesSubscription.remove();
  //       listener.remove();
  //     };
  //   } else {
  //     return () => undefined;
  //   }
  // }, []);

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
