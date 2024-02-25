import type { LeveledLogMethod, Logger } from "winston";
import { createLogger, format, transports } from "winston";

import { isDevelopment } from "../../environment.js";

export interface AuditLogger extends Logger {
  /**
   * Log a message with the level `insecure`
   *
   * Use this level for common activities that
   * influence users such as creating, updating,
   * or deleting a resource
   */
  normal: LeveledLogMethod;
  /**
   * Log a message with the level `secure`
   *
   * Use this level for more sensitive activities
   * such as deleting a user or modifying a team
   */
  sensitive: LeveledLogMethod;
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

const auditLogTransport = new transports.File({
  filename: "audit.log.json",
  maxsize: 1_000_000,
  maxFiles: 3,
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
  level: "dangerous",
});

export const auditLogger = createLogger({
  level: "secure",
  silent: isDevelopment,
  transports: [auditLogTransport, dangerousConsoleTransport],
  format: format.combine(format.timestamp(), format.json()),
  levels: {
    info: 0,
    dangerous: 2,
    sensitive: 4,
    normal: 6,
  },
}) as AuditLogger;

if (isDevelopment) {
  auditLogger.info("Audit Logger initialized");
}
