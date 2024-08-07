import { PrismaClient } from "@prisma/client";
import { DetailedError, ErrorCode } from "@ukdanceblue/common";
import { Container } from "typedi";

import { sqlLogger } from "#logging/sqlLogging.js";
import { logger } from "#logging/standardLogging.js";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "warn",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "query",
    },
  ],
});

prisma.$on("query", (e) => {
  sqlLogger.sql(e.query);
});
prisma.$on("info", (e) => {
  sqlLogger.info(e.message);
});
prisma.$on("warn", (e) => {
  sqlLogger.warning(e.message);
});
prisma.$on("error", (e) => {
  sqlLogger.error(e.message);
});

Container.set<typeof prisma>(PrismaClient, prisma);

if (!Container.has(PrismaClient)) {
  throw new DetailedError(
    ErrorCode.InternalFailure,
    "PrismaClient not registered"
  );
} else {
  logger.info("PrismaClient registered");
}
