import Router from "@koa/router";
import { AccessLevel } from "@ukdanceblue/common";

import { parseUserJwt } from "../../../lib/auth/index.js";
import { subscribeToLogs } from "../../../logger.js";

const logsApiRouter = new Router({ prefix: "/logs" });

logsApiRouter.get("/", (ctx) => {
  let token = ctx.cookies.get("token");
  if (!token) {
    const authorizationHeader = ctx.get("Authorization");
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      token = authorizationHeader.substring("Bearer ".length);
    }
  }

  if (!token) {
    ctx.status = 401;
    ctx.body = "Unauthorized";
    return;
  }

  const {
    auth: { accessLevel },
  } = parseUserJwt(token);

  if (accessLevel < AccessLevel.Admin) {
    ctx.status = 403;
    ctx.body = "Forbidden";
    return;
  }

  ctx.type = "text/event-stream";
  ctx.body = subscribeToLogs(() => {
    ctx.res.end();
  });
});

export default logsApiRouter;
