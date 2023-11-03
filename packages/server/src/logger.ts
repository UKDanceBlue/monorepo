import type { Primitive } from "utility-types";
import type winston from "winston";
import type { LeveledLogMethod, LoggerOptions } from "winston";
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
} satisfies winston.config.AbstractConfigSetColors;

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
    fileLogTransport,
    // TODO: Add a transport for errors that are sent to the database for display in the admin panel
  ],
  exitOnError: false,
} satisfies LoggerOptions;

const logger = createLogger(loggerOptions);

const consoleTransport = new transports.Console({
  format: format.combine(
    format.splat(),
    format.simple(),
    format.colorize({
      colors: syslogColors,
    })
  ),
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (!isProduction) {
  logger.add(consoleTransport);
}

logger.info("Logger initialized");

function logMessage(logLevel: string, content: unknown, ...data: unknown[]) {
  if (logger.isLevelEnabled(logLevel)) {
    const firstData = data.length === 1 ? data[0] : undefined;

    let stringifiedContent: string;
    if (!content) {
      stringifiedContent = "[NO MESSAGE]";
    } else if (typeof content === "string") {
      stringifiedContent = content;
    } else if (typeof content === "object") {
      stringifiedContent =
        content instanceof Error ? content.message : "[OBJECT]";
      data = [...data, content];
    } else {
      stringifiedContent = String(content);
    }

    return typeof firstData === "function"
      ? logger.log(
          logLevel,
          stringifiedContent,
          ...(firstData as () => (Primitive | object)[])()
        )
      : logger.log(logLevel, stringifiedContent, ...data);
  } else {
    return logger;
  }
}

/**
 * Log a debug message to the logger
 *
 * Use this log level for granular debug info such
 * as the contents of a variable or the result of
 * a function call.
 *
 * @param content The content to log (will be coerced to a string)
 * @param data Any additional data to log
 * @return void
 */
export const logDebug: LeveledLogMethod = (
  content: unknown,
  ...data: unknown[]
) => logMessage("debug", content, ...data);

/**
 * Log an info message to the logger
 *
 * Use this log level for general, but not usually
 * useful information such as the successful completion
 * of an operation.
 *
 * @param content The content to log (will be coerced to a string)
 * @param data Any additional data to log
 * @return void
 */
export const logInfo = (content: unknown, ...data: unknown[]) =>
  logMessage("info", content, ...data);

/**
 * Log a warning message to the logger
 *
 * Use this log level for a failure that is
 * not a SERIOUS problem and probably does not
 * require immediate attention.
 *
 * @param content The content to log (will be coerced to a string)
 * @param data Any additional data to log
 * @return void
 */
export const logWarning = (content: unknown, ...data: unknown[]) =>
  logMessage("warning", content, ...data);

/**
 * Log an error message to the logger
 *
 * Use this log level for a failure that is
 * a SERIOUS problem that needs attention
 * but does not necessarily indicate that
 * the server is in an unrecoverable state
 *
 * @param content The content to log (will be coerced to a string)
 * @param data Any additional data to log
 * @return void
 */
export const logError = (content: unknown, ...data: unknown[]) =>
  logMessage("error", content, ...data);

/**
 * Log a critical message to the logger
 *
 * Use this log level for a failure that is
 * a SERIOUS problem and probably means
 * that the server is in an unrecoverable state
 * when you want to stop anything else from
 * going wrong.
 *
 * @param content The content to log (will be coerced to a string)
 * @param data Any additional data to log
 * @return void
 */
export const logCritical = (content: unknown, ...data: unknown[]) =>
  logMessage("crit", content, ...data);

/**
 * Log an alert message to the logger
 *
 * Use this log level for a failure that is
 * a SERIOUS problem and probably means
 * that the server is in an unrecoverable state
 * when you want to stop anything else from
 * going wrong.
 *
 * @param content The content to log (will be coerced to a string)
 * @param data Any additional data to log
 * @return void
 */
export const logAlert = (content: unknown, ...data: unknown[]) =>
  logMessage("alert", content, ...data);

/**
 * Log an emergency message to the logger
 *
 * Use this log level for a failure that is
 * a SERIOUS problem and probably means
 * that the server is in an unrecoverable state
 *
 * @param content The content to log (will be coerced to a string)
 * @param data Any additional data to log
 * @return void
 */
export const logEmergency = (content: unknown, ...data: unknown[]) =>
  logMessage("emerg", content, ...data);

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

export default logger;
