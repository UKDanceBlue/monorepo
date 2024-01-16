import { isError } from "lodash";

import { Logger } from "./logger/Logger";

/** @deprecated Use the Logger class directly */
export function log(
  message: string | boolean | number | object,
  level: "trace" | "debug" | "log" | "info" | "warn" | "error" = "log"
) {
  switch (level) {
    case "trace":
    case "debug": {
      Logger.debug(message);
      break;
    }
    case "log": {
      Logger.log(message);
      break;
    }
    case "info": {
      Logger.info(message);
      break;
    }
    case "warn": {
      Logger.warn(message);
      break;
    }
    case "error": {
      Logger.error(message);
      break;
    }
  }
}

/** @deprecated Use the Logger class directly */
export function logError(error: Error) {
  Logger.error(error.message, { error });
}

/** @deprecated I want to switch to using a more user-friendly error handler than this */
export function universalCatch(error: unknown) {
  try {
    if (isError(error)) {
      logError(error);
    } else if (
      typeof error === "string" ||
      typeof error === "number" ||
      typeof error === "boolean" ||
      (typeof error === "object" && error !== null)
    ) {
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
