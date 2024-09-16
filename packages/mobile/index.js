// @ts-check
import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  configureScope as configureSentryScope,
  init as initSentry,
  ReactNativeTracing,
  wrap as wrapWithSentry,
} from "@sentry/react-native";
import { isRunningInExpoGo, registerRootComponent } from "expo";
import { DevMenu, isDevelopmentBuild } from "expo-dev-client";
import { setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync } from "expo-splash-screen";
import { channel, isEmbeddedLaunch, manifest, updateId } from "expo-updates";
import { Alert, LogBox } from "react-native";

import App from "./App";
import { overrideApiBaseUrl } from "./src/common/apiUrl";
import { Logger } from "./src/common/logger/Logger";
import { routingInstrumentation } from "./src/navigation/routingInstrumentation";

const metadata = "metadata" in manifest ? manifest.metadata : undefined;
const extra = "extra" in manifest ? manifest.extra : undefined;
const updateGroup =
  metadata && "updateGroup" in metadata ? metadata.updateGroup : undefined;

Logger.debug("Starting app");

void preventAutoHideAsync();

LogBox.ignoreLogs([
  "'SplashScreen.show' has already been called for given view controller.",
]);
LogBox.ignoreLogs([
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.",
]);

initSentry({
  dsn: "https://f8d08f6f2a9dd8d627a9ed4b99fb4ba4@o4507762130681856.ingest.us.sentry.io/4507762137825280",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: __DEV__ ? 1 : 0.2,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: __DEV__ ? 1 : 0.2,
  },
  debug: false,
  integrations: [
    new ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
    }),
  ],
  environment: channel ?? (isDevelopmentBuild() ? "dev-client" : "unknown"),
  enabled: !isDevelopmentBuild(),
});

configureSentryScope((scope) => {
  scope.setTag("expo-update-id", updateId);
  scope.setTag("expo-is-embedded-update", isEmbeddedLaunch);

  if (typeof updateGroup === "string") {
    scope.setTag("expo-update-group-id", updateGroup);

    const owner = extra?.expoClient?.owner ?? "[account]";
    const slug = extra?.expoClient?.slug ?? "[project]";
    scope.setTag(
      "expo-update-debug-url",
      `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
    );
  } else if (isEmbeddedLaunch) {
    // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
    scope.setTag("expo-update-debug-url", "embedded");
  }
});

if (isDevelopmentBuild()) {
  DevMenu.registerDevMenuItems([
    {
      name: "Clear AsyncStorage",
      callback: async () => {
        Logger.log("Clearing AsyncStorage");
        await AsyncStorage.clear();
        Alert.alert("AsyncStorage cleared successfully");
      },
    },
    {
      name: "Print AsyncStorage",
      callback: async () => {
        Logger.log("Printing AsyncStorage");
        const keys = await AsyncStorage.getAllKeys();
        const values = await AsyncStorage.multiGet(keys);
        console.log(values);
      },
    },
    {
      name: "Override url",
      callback: () => {
        Logger.log("Overriding url");
        Alert.prompt(
          "Enter the url to override or blank for default",
          "",
          overrideApiBaseUrl
        );

        return Promise.resolve();
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

try {
  registerRootComponent(wrapWithSentry(App));
} catch (error) {
  Logger.error("Error registering root component", { error });
  throw error;
}
