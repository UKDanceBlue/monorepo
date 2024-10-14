import { logDir, loggingLevel } from "#environment";

import { createLogger, format, transports } from "winston";

import type winston from "winston";

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
  dirname: logDir,
  silent: logDir === "TEST",
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
