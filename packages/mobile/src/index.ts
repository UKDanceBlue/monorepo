import "./global.css";

import * as Sentry from "@sentry/react-native";
import { isDevelopmentBuild } from "expo-dev-client";
import { setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync } from "expo-splash-screen";
import { emergencyLaunchReason, isEmergencyLaunch } from "expo-updates";
import { channel, isEmbeddedLaunch, manifest, updateId } from "expo-updates";
import { Alert } from "react-native";

import { navigationIntegration } from "./lib/instrumentation/routingInstrumentation";
import { Logger } from "./lib/logger/Logger";

const metadata = "metadata" in manifest ? manifest.metadata : undefined;
const extra = "extra" in manifest ? manifest.extra : undefined;
const updateGroup =
  metadata && "updateGroup" in metadata ? metadata.updateGroup : undefined;

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
  // enableNativeFramesTracking: !isRunningInExpoGo(),
  environment: channel ?? (isDevelopmentBuild() ? "dev-client" : "unknown"),
  enabled: !__DEV__,
  initialScope: {},
});

Sentry.setTag("expo-update-id", updateId);
Sentry.setTag("expo-is-embedded-update", isEmbeddedLaunch);

if (typeof updateGroup === "string") {
  Sentry.setTag("expo-update-group-id", updateGroup);

  const owner = extra?.expoClient?.owner ?? "ukdanceblue";
  const slug = extra?.expoClient?.slug ?? "mobile";
  Sentry.setTag(
    "expo-update-debug-url",
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
  );
} else if (isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  Sentry.setTag("expo-update-debug-url", "embedded");
}

if (isEmergencyLaunch) {
  Alert.alert(
    "A CRITICAL ERROR HAS OCCURRED!",
    "You are running a fallback version of the app and will likely experience issues. Please try to restart the app to fix this issue. If the issue persists, please contact the Tech Committee."
  );
  Sentry.captureException(
    new Error(`Emergency launch: ${emergencyLaunchReason}`)
  );
}

setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

import "expo-router/entry";
