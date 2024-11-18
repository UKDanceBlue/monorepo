import { Container } from "@freshgum/typedi";
import type { LeveledLogMethod, Logger } from "winston";
import { createLogger, format, transports } from "winston";

import { logDirToken } from "#lib/environmentTokens.js";
import { isDevelopment } from "#lib/nodeEnv.js";

const logDir = Container.get(logDirToken);

export interface AuditLogger extends Logger {
  /**
   * Log a message with the level `insecure`
   *
   * Use this level for common activities that
   * influence users such as creating, updating,
   * or deleting a resource
   */
  insecure: LeveledLogMethod;
  /**
   * Log a message with the level `secure`
   *
   * Use this level for more sensitive activities
   * such as deleting a user or modifying a team
   */
  secure: LeveledLogMethod;
  /**
   * Log a message with the level `secure`
   *
   * Use this level for an action that might break
   * something or is otherwise dangerous such as
   * changing configurations
   */
  dangerous: LeveledLogMethod;
  /**
   * Log a message with the level `info`
   *
   * Use this level for general information
   * about the operation of the server or
   * the logger itself
   */
  info: LeveledLogMethod;

  warn: never;
  help: never;
  data: never;
  debug: never;
  prompt: never;
  http: never;
  verbose: never;
  input: never;
  silly: never;
  emerg: never;
  alert: never;
  crit: never;
  warning: never;
  notice: never;
}

export const auditLoggerFileName = "audit.log.json";

const auditLogTransport = new transports.File({
  filename: auditLoggerFileName,
  dirname: logDir,
  silent: logDir === "TEST",
  maxsize: 1_000_000,
  maxFiles: 3,
  format: format.combine(format.timestamp(), format.json()),
});

const dangerousConsoleTransport = new transports.Console({
  format: format.combine(
    format.splat(),
    format.simple(),
    format.colorize({
      colors: {
        dangerous: "red",
        secure: "yellow",
        insecure: "yellow",
        info: "green",
      },
    })
  ),
});

export const auditLogger = createLogger({
  level: "info",
  silent: false,
  transports: [auditLogTransport, dangerousConsoleTransport],
  levels: {
    info: 6,
    insecure: 4,
    secure: 2,
    dangerous: 0,
  },
}) as AuditLogger;

if (isDevelopment) {
  auditLogger.info("Audit Logger initialized");
}
