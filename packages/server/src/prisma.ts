import { PrismaClient } from "@prisma/client";
import { Container } from "typedi";

export const prisma = new PrismaClient();

Container.set<typeof prisma>(PrismaClient, prisma);

if (!Container.has(PrismaClient)) {
  throw new Error("PrismaClient not registered");
} else {
  console.log("PrismaClient registered");
}
