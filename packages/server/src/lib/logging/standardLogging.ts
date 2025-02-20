import { Container } from "@freshgum/typedi";
import * as Sentry from "@sentry/node";
import { debugStringify } from "@ukdanceblue/common";
import { ExtendedError } from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import type winston from "winston";
import type { Logform } from "winston";
import { createLogger, format, transports } from "winston";

import { logDirToken, loggingLevelToken } from "#lib/typediTokens.js";

import { SyslogLevels } from "./SyslogLevels.js";

interface StandardLogger extends winston.Logger {
  emerg: winston.LeveledLogMethod;
  alert: winston.LeveledLogMethod;
  crit: winston.LeveledLogMethod;
  error: winston.LeveledLogMethod;
  warning: winston.LeveledLogMethod;
  notice: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  debug: winston.LeveledLogMethod;
  trace: winston.LeveledLogMethod;

  warn: never;
  help: never;
  data: never;
  prompt: never;
  http: never;
  verbose: never;
  input: never;
  silly: never;
}

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
    format.colorize({
      colors: syslogColors,
    }),
    format.printf(
      ({ level, message, error, ...rest }: Logform.TransformableInfo) => {
        if (error instanceof ExtendedError) {
          rest.error = `${error.tag.description} - ${error.detailedMessage} - ${error.stack}`;
        } else if (error instanceof Error) {
          rest.error = `${error.name} - ${error.message} - ${error.stack}`;
        } else if (error != null) {
          rest.error = debugStringify(error);
        }

        const filteredRestEntries = Object.entries(rest).filter(
          ([key]) => typeof key !== "symbol"
        );

        return filteredRestEntries.length > 0
          ? `${level}: ${debugStringify(message)} ${debugStringify(Object.fromEntries(filteredRestEntries), true, true)}`
          : `${level}: ${debugStringify(message)}`;
      }
    )
  ),
});

const combinedLogTransport = new transports.File({
  filename: "combined.log",
  maxsize: 1_000_000,
  maxFiles: 3,
  get dirname() {
    return Container.getOrNull(logDirToken) ?? ".";
  },
  get silent() {
    const logDir = Container.getOrNull(logDirToken);
    if (logDir == null) {
      return true;
    }
    return logDir === "TEST";
  },
  format: format.json({}),
});

export const logger = createLogger({
  get level() {
    return Container.getOrNull(loggingLevelToken) ?? "debug";
  },
  levels: SyslogLevels,
  transports: [combinedLogTransport, consoleTransport],
  exitOnError: false,
}) as StandardLogger;

export function breadCrumbTrace(
  message: string,
  data?: Record<string, unknown>
) {
  logger.trace(message, data);
  Sentry.addBreadcrumb({
    message,
    data,
    category: "trace",
    timestamp: DateTime.now().toSeconds(),
    level: "debug",
  });
}

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

  logger.emerg(String(content), () => process.exit(1));
}

logger.info("Logger initialized");
