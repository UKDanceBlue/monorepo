import { createLogger, format } from "winston";

import { isDevelopment } from "../../environment.js";

import { databaseLogTransport } from "./transports/fileLogTransports.js";

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
});

if (isDevelopment) {
  sqlLogger.info("SQL Logger initialized");
}
