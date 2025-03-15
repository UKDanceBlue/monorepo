import isError from "lodash/isError";

import { Logger } from "./logger/Logger";

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
