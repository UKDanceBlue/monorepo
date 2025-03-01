// This file is first imported by index.ts

import type { ExtendedError } from "@ukdanceblue/common/error";

import { captureError } from "#lib/captureExtendedError.js";

import { logger } from "./standardLogging.js";

export { sqlLogger } from "./sqlLogging.js";
export { logFatal, logger } from "./standardLogging.js";

export function logError(error: ExtendedError, message?: string) {
  logger.error(message ?? String(error), { error });
  captureError(error);
}
