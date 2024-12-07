import { Container } from "@freshgum/typedi";
import { debugStringify } from "@ukdanceblue/common";
import type winston from "winston";
import type { Logform } from "winston";
import { createLogger, format, transports } from "winston";

import { logDirToken, loggingLevelToken } from "#lib/typediTokens.js";

import { SyslogLevels } from "./SyslogLevels.js";

const logDir = Container.get(logDirToken);
const loggingLevel = Container.get(loggingLevelToken);

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
    format.printf(({ level, message, ...rest }: Logform.TransformableInfo) => {
      const filteredRestEntries = Object.entries(rest).filter(
        ([key]) => typeof key !== "symbol"
      );

      return filteredRestEntries.length > 0
        ? `${level}: ${debugStringify(message)} ${debugStringify(Object.fromEntries(filteredRestEntries), true, false)}`
        : `${level}: ${debugStringify(message)}`;
    })
  ),
});

const combinedLogTransport = new transports.File({
  filename: "combined.log",
  maxsize: 1_000_000,
  maxFiles: 3,
  dirname: logDir,
  silent: logDir === "TEST",
  format: format.json({}),
});

export const logger = createLogger({
  level: loggingLevel,
  levels: SyslogLevels,
  transports: [combinedLogTransport, consoleTransport],
  exitOnError: false,
}) as StandardLogger;

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
