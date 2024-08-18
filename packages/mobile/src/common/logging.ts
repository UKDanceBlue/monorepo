import { Logger } from "./logger/Logger";

import { isError } from "lodash";

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

export function universalCatch(error: unknown) {
  try {
    if (isError(error)) {
      Logger.error("Caught error", { error });
    } else if (
      typeof error === "string" ||
      typeof error === "number" ||
      typeof error === "boolean" ||
      (typeof error === "object" && error !== null)
    ) {
      Logger.error(String(error));
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
