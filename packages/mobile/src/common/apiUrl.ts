// import Constants from "expo-constants";

// let url = "https://app.danceblue.org";
// if (process.env.NODE_ENV === "development") {
//   const developmentUrl = Constants.expoGoConfig?.debuggerHost
//     ?.split(":")
//     .shift();
//   url = developmentUrl
//     ? `http://${developmentUrl}:8000`
//     : "http://localhost:8000";
// }

import { reloadAsync } from "expo-updates";

import { Logger } from "./logger/Logger";

export let API_BASE_URL =
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://app.danceblue.org";

export function overrideApiBaseUrl(newUrl: string) {
  API_BASE_URL =
    newUrl ||
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "https://app.danceblue.org";
  reloadAsync().catch((error: unknown) => {
    Logger.error("Failed to reload app", {
      error,
      source: "overrideApiBaseUrl",
    });
  });
}
