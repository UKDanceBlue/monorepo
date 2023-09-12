import crashlytics from "@react-native-firebase/crashlytics";
import { isError } from "lodash";

import { isFirebaseError } from "../types/firebaseTypes";

export function log(message: string | boolean | number | object, level: "trace" | "debug" | "log" | "info" | "warn" | "error" = "log") {
  try {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      const consoleMethod = console[level];
      if (typeof consoleMethod === "function") {
        consoleMethod(message);
      } else {
        // eslint-disable-next-line no-console
        console.log(message);
      }
    } else {
      if (typeof message === "object") {
        message = JSON.stringify(message, null, 2);
      }
      crashlytics().log(message.toString());
    }
  } catch (error) {
    console.error(error);
  }
}

export function logError(error: Error) {
  try {
    log("JavaScript Error:", "error");
    log(error, "error");

    if (!__DEV__) {
      crashlytics().recordError(error);
    }
  } catch (error) {
    console.error(error);
  }
}

export function universalCatch(error: unknown) {
  try {
    if (isFirebaseError(error)) {
      log(`Error ${error.name}: ${error.code}\n${error.message}`, "error");
      logError(error);
    } else if (isError(error)) {
      logError(error);
    } else if (typeof error === "string" || typeof error === "number" || typeof error === "boolean" || (typeof error === "object" && error !== null)) {
      log(error, "error");
    } else {
      console.error(error);
    }
  } catch (error) {
    try {
      console.error(error);
    } catch {
      // ignore, we don't want a looping crash
    }
  }
}
