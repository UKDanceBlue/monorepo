import { Container } from "@freshgum/typedi";
import { PrismaClient } from "@prisma/client";

import { prismaToken } from "#lib/typediTokens.js";
import { sqlLogger } from "#logging/sqlLogging.js";
import { logger } from "#logging/standardLogging.js";

const prisma = new PrismaClient({
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

// Typescript takes a full second to make sure the types are correct, so we just cast to any to avoid that
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Container.setValue(prismaToken, prisma as any);

if (!Container.has(prismaToken)) {
  throw new Error("PrismaClient not registered");
} else {
  logger.info("PrismaClient registered");
}
