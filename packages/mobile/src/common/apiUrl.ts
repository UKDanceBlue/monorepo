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

import { channel, reloadAsync } from "expo-updates";

import { Logger } from "./logger/Logger";

let url = "https://app.danceblue.org";
if (
  process.env.NODE_ENV === "development" &&
  process.env.EXPO_PUBLIC_API_BASE_URL
) {
  url = String(process.env.EXPO_PUBLIC_API_BASE_URL);
} else {
  switch (channel) {
    case "release": {
      url = "https://app.danceblue.org";
      break;
    }
    case "staging": {
      url = "https://stg.danceblue.org";
      break;
    }
    case "main": {
      url = "https://app.danceblue.org";
      break;
    }
    case null: {
      break;
    }
    default: {
      Logger.warn(`Unknown channel '${channel}'`, {
        source: "apiUrl",
      });
    }
  }
}

export let API_BASE_URL = url;

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
