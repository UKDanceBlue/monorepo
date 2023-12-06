import Router from "@koa/router";
import { AccessLevel } from "@ukdanceblue/common";

import { parseUserJwt } from "../../../lib/auth/index.js";
import { logStream } from "../../../logger.js";

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

  return new Promise<void>((resolve, reject) => {
    ctx.type = "text/event-stream";
    ctx.status = 200;

    const keepAliveInterval = setInterval(() => {
      ctx.res.write(":keepalive\n\n");
    }, 15_000);

    logStream.on("data", (chunk) => {
      console.log(chunk);
    });

    logStream.addWriteable(ctx.res);
    ctx.res.on("error", (error) => {
      reject(error);
      clearInterval(keepAliveInterval);
    });
    ctx.res.on("close", () => {
      resolve();
      clearInterval(keepAliveInterval);
    });
  });
});

export default logsApiRouter;
