import type winston from "winston";
import type { LoggerOptions } from "winston";
import { createLogger, format, transports } from "winston";

import { isDevelopment, isProduction } from "./environment.js";

const fileErrorLogTransport = new transports.File({
  filename: "error.log",
  level: "error",
});

const fileLogTransport = new transports.File({
  filename: "combined.log",
  maxsize: 1_000_000,
  maxFiles: 3,
});

const syslogLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
  trace: 8,
} satisfies winston.config.AbstractConfigSetLevels;

const syslogColors = {
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
    format.splat(),
    format.simple(),
    format.colorize({
      colors: syslogColors,
    })
  ),
});

const loggerOptions = {
  level: "debug",
  levels: syslogLevels,
  format: format.combine(
    format.splat(),
    format.colorize({ level: true, message: false }),
    format.json()
  ),
  transports: [
    fileErrorLogTransport,
    consoleTransport,
    // TODO: Add a transport for errors that are sent to the database for display in the admin panel
  ],
  exitOnError: false,
} satisfies LoggerOptions;

const logger = createLogger(loggerOptions);

// If we're not in production then log to the `combined.log` file as well
if (!isProduction) {
  logger.add(fileLogTransport);
}

logger.info("Logger initialized");

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

const databaseLogTransport = new transports.File({
  filename: "database.log",
  maxsize: 1_000_000,
  maxFiles: 3,
});

export const sqlLogger = createLogger({
  ...loggerOptions,
  level: "sql",
  levels: {
    sql: 3,
    info: 2,
    warning: 1,
    error: 0,
  },
  transports: isDevelopment
    ? [databaseLogTransport]
    : [
        /* In production this logger should never be used, but just in case someone tries to use it, we'll disable the transport */
      ],
  format: format.combine(format.timestamp(), format.simple()),
});

if (isDevelopment) {
  sqlLogger.info("SQL Logger initialized");
}

export { logger };
