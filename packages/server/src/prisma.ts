import { PrismaClient } from "@prisma/client";
import { DetailedError, ErrorCode } from "@ukdanceblue/common";
import { Container } from "typedi";

import { logger } from "./lib/logging/standardLogging.js";

export const prisma = new PrismaClient();

Container.set<typeof prisma>(PrismaClient, prisma);

if (!Container.has(PrismaClient)) {
  throw new DetailedError(
    ErrorCode.InternalFailure,
    "PrismaClient not registered"
  );
} else {
  logger.info("PrismaClient registered");
}
