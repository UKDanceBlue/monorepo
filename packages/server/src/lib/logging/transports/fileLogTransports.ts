import { transports } from "winston";

export const combinedLogTransport = new transports.File({
  filename: "combined.log",
  maxsize: 1_000_000,
  maxFiles: 3,
});

export const databaseLogTransport = new transports.File({
  filename: "database.log",
  maxsize: 1_000_000,
  maxFiles: 3,
});

export const auditLogTransport = new transports.File({
  filename: "audit.log.json",
  maxsize: 1_000_000,
  maxFiles: 3,
});
