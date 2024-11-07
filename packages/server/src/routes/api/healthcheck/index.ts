import { Service } from "@freshgum/typedi";
import { PrismaClient } from "@prisma/client";

import { RouterService } from "#routes/RouteService.js";

import { prismaToken } from "../../../prisma.js";

@Service([prismaToken])
export default class HealthCheckRouter extends RouterService {
  constructor(prisma: PrismaClient) {
    super("/healthcheck");

    this.addGetRoute("/", async (ctx) => {
      try {
        await prisma.$connect();
      } catch (error) {
        ctx.type = "text/plain";
        ctx.body = "Database connection error";
        ctx.status = 500;
        return;
      }

      ctx.type = "text/plain";
      ctx.body = "OK";
      ctx.status = 200;
    });
  }
}
