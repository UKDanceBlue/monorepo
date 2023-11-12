import Router from "@koa/router";

import { login } from "./login.js";
import { oidcCallback } from "./oidcCallback.js";

const authApiRouter = new Router({ prefix: "/auth" });

authApiRouter.get("/logout", (ctx) => {
  // logout(req, res);
  ctx.redirect("/");
});

authApiRouter.post("/oidc-callback", oidcCallback);

authApiRouter.get("/login", login);

export default authApiRouter;
