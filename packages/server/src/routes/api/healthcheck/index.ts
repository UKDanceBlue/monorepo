import Router from "@koa/router";

import { prisma } from "../../../prisma.js";

const healthCheckRouter = new Router({ prefix: "/healthcheck" });

healthCheckRouter.get("/", async (ctx) => {
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

export default healthCheckRouter;
