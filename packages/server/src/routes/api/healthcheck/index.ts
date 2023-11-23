import Router from "@koa/router";

import { sequelizeDb } from "../../../data-source.js";

const healthCheckRouter = new Router({ prefix: "/healthcheck" });

healthCheckRouter.get("/", async (ctx) => {
  try {
    await sequelizeDb.authenticate();
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
