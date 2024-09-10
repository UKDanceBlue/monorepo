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

import { Logger } from "./logger/Logger";

import { reloadAsync } from "expo-updates";

export let API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://app.danceblue.org";

export function overrideApiBaseUrl(newUrl: string) {
  API_BASE_URL =
    newUrl ||
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "https://app.danceblue.org";
  reloadAsync().catch((error: unknown) => {
    Logger.error("Failed to reload app", {
      error,
      source: "overrideApiBaseUrl",
    });
  });
}
