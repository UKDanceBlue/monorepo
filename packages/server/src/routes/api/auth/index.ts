import Router from "@koa/router";
import { koaBody } from "koa-body";

import { anonymousLogin } from "./anonymous.js";
import { login } from "./login.js";
import { oidcCallback } from "./oidcCallback.js";

const authApiRouter = new Router({ prefix: "/auth" });

authApiRouter.get("/logout", (ctx) => {
  ctx.cookies.set("token", null);

  let redirectTo = "/";
  const queryRedirectTo = Array.isArray(ctx.query.redirectTo)
    ? ctx.query.redirectTo[0]
    : ctx.query.redirectTo;
  if (queryRedirectTo && queryRedirectTo.length > 0) {
    redirectTo = queryRedirectTo;
  }

  ctx.redirect(redirectTo);
});

authApiRouter.post(
  "/oidc-callback",
  koaBody({
    text: false,
    json: false,
    urlencoded: true,
    multipart: false,
  }),
  oidcCallback
);

authApiRouter.get("/login", login);

authApiRouter.get("/anonymous", anonymousLogin);

export default authApiRouter;
