import type winston from "winston";
import { createLogger, format, transports } from "winston";

import { loggingLevel } from "../../environment.js";

export const SyslogLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
  trace: 8,
} as const satisfies winston.config.AbstractConfigSetLevels;
export type SyslogLevels = keyof typeof SyslogLevels;

export const syslogColors = {
  emerg: "red",
  alert: "yellow",
  crit: "red",
  error: "red",
  warning: "red",
  notice: "yellow",
  info: "green",
  debug: "blue",
  trace: "gray",
} satisfies winston.config.AbstractConfigSetColors;

const consoleTransport = new transports.Console({
  format: format.combine(
    format.errors(),
    format.splat(),
    format.simple(),
    format.colorize({
      colors: syslogColors,
    })
  ),
});

const combinedLogTransport = new transports.File({
  filename: "combined.log",
  maxsize: 1_000_000,
  maxFiles: 3,
});

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
