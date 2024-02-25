import { createLogger, format } from "winston";

import { loggingLevel } from "../../environment.js";

import { SyslogLevels } from "./base.js";
import { consoleTransport } from "./transports/consoleTransport.js";
import { combinedLogTransport } from "./transports/fileLogTransports.js";

export const logger = createLogger({
  level: loggingLevel,
  levels: SyslogLevels,
  format: format.combine(
    format.splat(),
    format.colorize({ level: true, message: false }),
    format.json()
  ),
  transports: [combinedLogTransport, consoleTransport],
  exitOnError: false,
});

/**
 * Log a fatal message to the logger
 *
 * Use this log level for a failure that is
 * a SERIOUS problem and probably means
 * that the server is in an unrecoverable state
 * when you want to stop anything else from
 * going wrong.
 *
 * WARNING: This will terminate the process
 * do not use this unless the server is in
 * an unrecoverable state
 *
 * @param content The content to log (will be coerced to a string)
 */
export function logFatal(content: unknown) {
  // Logs the error and then crashes the server
  // eslint-disable-next-line no-process-exit -- This needs to bypass any try/catch blocks
  logger.emerg(String(content), () => process.exit(1));
}

logger.info("Logger initialized");
