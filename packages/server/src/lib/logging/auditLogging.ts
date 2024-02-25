import type { LeveledLogMethod, Logger } from "winston";
import { createLogger, format } from "winston";

import { isDevelopment } from "../../environment.js";

import { auditLogTransport } from "./transports/fileLogTransports.js";

export interface AuditLogger extends Logger {
  insecure: LeveledLogMethod;
  secure: LeveledLogMethod;
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

export const auditLogger = createLogger({
  level: "secure",
  silent: isDevelopment,
  transports: auditLogTransport,
  format: format.combine(format.timestamp(), format.json()),
  levels: {
    insecure: 0,
    secure: 1,
    info: 2,
  },
}) as AuditLogger;

if (isDevelopment) {
  auditLogger.info("Audit Logger initialized");
}
