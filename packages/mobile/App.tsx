// Import third-party dependencies
import { useAsyncStorageDevTools } from "@dev-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { isDevelopmentBuild, registerDevMenuItems } from "expo-dev-client";
import { useFonts } from "expo-font";
import { setNotificationHandler } from "expo-notifications";
import { hideAsync } from "expo-splash-screen";
import { preventAutoHideAsync } from "expo-splash-screen";
// TODO: Switch away from native-base https://nativebase.io/blogs/road-ahead-with-gluestack-ui
import { isEmergencyLaunch } from "expo-updates";
import { channel, isEmbeddedLaunch, manifest, updateId } from "expo-updates";
import type { ICustomTheme } from "native-base";
import { NativeBaseProvider } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ErrorBoundary from "@/common/components/ErrorBoundary";
import { useUpdateChecker } from "@/common/hooks/useUpdateChecker";
import { Logger } from "@/common/logger/Logger";
import { universalCatch } from "@/common/logging";
import { showMessage } from "@/common/util/alertUtils";
import { AuthStateProvider } from "@/context/auth";
import { DeviceDataProvider } from "@/context/device";
import { LoadingWrapper } from "@/context/loading";
import { UrqlContext } from "@/context/urql";
import { navigationIntegration } from "@/navigation/routingInstrumentation";

import BoldoniFlfBoldFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold.ttf";
import BoldoniFlfBoldItalicFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold-Italic.ttf";
import BoldoniFlfItalicFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Italic.ttf";
import BoldoniFlfRomanFont from "./assets/fonts/bodoni-flf-font/Bodoni-FLF-Roman.ttf";
import OpenSansCondensedBoldFont from "./assets/fonts/opensans-condensed/OpenSans-Condensed-Bold.ttf";
import OpenSansCondensedLightFont from "./assets/fonts/opensans-condensed/OpenSans-Condensed-Light.ttf";
import OpenSansCondensedLightItalicFont from "./assets/fonts/opensans-condensed/OpenSans-Condensed-Light-Italic.ttf";
import { overrideApiBaseUrl } from "./src/common/apiUrl";
import { FilledNavigationContainer } from "./src/navigation/NavigationContainer";
import { getCustomTheme } from "./src/theme";

const metadata = "metadata" in manifest ? manifest.metadata : undefined;
const extra = "extra" in manifest ? manifest.extra : undefined;
const updateGroup =
  metadata && "updateGroup" in metadata ? metadata.updateGroup : undefined;

if (isEmergencyLaunch) {
  Alert.alert(
    "A CRITICAL ERROR HAS OCCURRED!",
    "You are running a fallback version of the app and will likely experience issues. Please try to restart the app to fix this issue. If the issue persists, please contact the Tech Committee."
  );
}

Logger.debug("Starting app");

void preventAutoHideAsync();

Sentry.init({
  dsn: "https://f8d08f6f2a9dd8d627a9ed4b99fb4ba4@o4507762130681856.ingest.us.sentry.io/4507762137825280",
  tracesSampleRate: 0.2,
  _experiments: {
    profilesSampleRate: 0.2,
  },
  debug: false,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
  environment: channel ?? (isDevelopmentBuild() ? "dev-client" : "unknown"),
  enabled: !__DEV__,
  initialScope: {},
});

Sentry.setTag("expo-update-id", updateId);
Sentry.setTag("expo-is-embedded-update", isEmbeddedLaunch);

if (typeof updateGroup === "string") {
  Sentry.setTag("expo-update-group-id", updateGroup);

  const owner = extra?.expoClient?.owner ?? "[account]";
  const slug = extra?.expoClient?.slug ?? "[project]";
  Sentry.setTag(
    "expo-update-debug-url",
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
  );
} else if (isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  Sentry.setTag("expo-update-debug-url", "embedded");
}

if (isDevelopmentBuild()) {
  registerDevMenuItems([
    {
      name: "Clear AsyncStorage",
      callback: () => {
        Logger.info("Clearing AsyncStorage");
        AsyncStorage.clear()
          .then(() => {
            Alert.alert("AsyncStorage cleared successfully");
          })
          .catch((error) => {
            Logger.error("Error clearing AsyncStorage", { error });
            Alert.alert("Error clearing AsyncStorage");
          });
      },
    },
    {
      name: "Print AsyncStorage",
      callback: () => {
        Logger.info("Printing AsyncStorage");
        AsyncStorage.getAllKeys()
          .then((keys) => AsyncStorage.multiGet(keys))
          .then((values) => {
            Logger.info(
              `AsyncStorage values:\n${JSON.stringify(values, null, 2)}`
            );
          })
          .catch((error) => {
            Logger.error("Error printing AsyncStorage", { error });
          });
      },
    },
    {
      name: "Override url",
      callback: () => {
        Logger.info("Overriding url");
        Alert.prompt(
          "Enter the url to override or blank for default",
          "",
          overrideApiBaseUrl
        );
      },
    },
  ]).catch(/** @param {unknown} error */ (error) => console.error(error));
}

// Configure the notifications handler to decide what to do when a notification is received if the app is open
setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

/**
 * Main app container
 */
const App = Sentry.wrap(() => {
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
      Logger.error("Error loading fonts", { error });
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
            <LoadingWrapper>
              <AuthStateProvider>
                <DeviceDataProvider>
                  <GestureHandlerRootView>
                    <View style={{ minHeight: "100%", minWidth: "100%" }}>
                      <ErrorBoundary>
                        <FilledNavigationContainer />
                      </ErrorBoundary>
                    </View>
                  </GestureHandlerRootView>
                </DeviceDataProvider>
              </AuthStateProvider>
            </LoadingWrapper>
          </UrqlContext>
        </ErrorBoundary>
      </NativeBaseProvider>
    )
  );
});

function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWrapper;
