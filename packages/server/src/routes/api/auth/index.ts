import Router from "@koa/router";
import { koaBody } from "koa-body";

import { login } from "./login.js";
import { oidcCallback } from "./oidcCallback.js";

const authApiRouter = new Router({ prefix: "/auth" });

authApiRouter.get("/logout", (ctx) => {
  // logout(req, res);
  ctx.redirect("/");
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

export default authApiRouter;
