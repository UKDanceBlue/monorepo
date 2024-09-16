import { sqlLogger } from "#logging/sqlLogging.js";
import { logger } from "#logging/standardLogging.js";

import { PrismaClient } from "@prisma/client";
import { Container, Token } from "@freshgum/typedi";

export const prismaToken = new Token<PrismaClient>("PrismaClient");

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

Container.setValue(prismaToken, prisma);

if (!Container.has(prismaToken)) {
  throw new Error("PrismaClient not registered");
} else {
  logger.info("PrismaClient registered");
}
