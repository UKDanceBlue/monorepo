import Constants from "expo-constants";

let url = "https://app.danceblue.org";
if (process.env.NODE_ENV === "development") {
  const developmentUrl = Constants.expoGoConfig?.debuggerHost
    ?.split(":")
    .shift();
  url = developmentUrl
    ? `http://${developmentUrl}:8000`
    : "http://localhost:8000";
}

export const API_BASE_URL = url;
