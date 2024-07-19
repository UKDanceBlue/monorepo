import type winston from "winston";
import { createLogger, format, transports } from "winston";

import { isDevelopment, logDir } from "#environment";

const databaseLogTransport = new transports.File({
  filename: "database.log",
  maxsize: 1_000_000,
  maxFiles: 1,
  dirname: logDir,
});

interface SqlLogger extends winston.Logger {
  error: winston.LeveledLogMethod;
  warning: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  sql: winston.LeveledLogMethod;

  emerg: never;
  alert: never;
  crit: never;
  notice: never;
  debug: never;
  trace: never;
  warn: never;
  help: never;
  data: never;
  prompt: never;
  http: never;
  verbose: never;
  input: never;
  silly: never;
}

export const sqlLogger = createLogger({
  exitOnError: false,
  level: "sql",
  levels: {
    sql: 3,
    info: 2,
    warning: 1,
    error: 0,
  },
  transports: isDevelopment ? databaseLogTransport : [],
  silent: !isDevelopment,
  format: format.combine(format.timestamp(), format.simple()),
}) as SqlLogger;

if (isDevelopment) {
  sqlLogger.info("SQL Logger initialized");
}
