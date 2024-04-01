import { PrismaClient } from "@prisma/client";
import { Container } from "typedi";

import { logger } from "./lib/logging/standardLogging.js";

export const prisma = new PrismaClient();

Container.set<typeof prisma>(PrismaClient, prisma);

if (!Container.has(PrismaClient)) {
  throw new Error("PrismaClient not registered");
} else {
  logger.info("PrismaClient registered");
}
