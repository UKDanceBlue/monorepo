import { Service } from "@freshgum/typedi";
import { anonymousLogin } from "./anonymous.js";
import { demoLogin } from "./demo.js";
import { login } from "./login.js";
import { oidcCallback } from "./oidcCallback.js";

import { koaBody } from "koa-body";
import { RouterService } from "#routes/RouteService.js";

// TODO: Replace custom OAuth2 + middleware implementation with Passport.js and oauth2orize
// https://www.passportjs.org
// https://github.com/jaredhanson/oauth2orize

@Service([])
export default class AuthRouter extends RouterService {
  constructor() {
    super("/auth");

    this.addGetRoute("/logout", (ctx) => {
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

    this.addPostRoute(
      "/oidc-callback",
      koaBody({
        text: false,
        json: false,
        urlencoded: true,
        multipart: false,
      }),
      oidcCallback
    );

    this.addGetRoute("/login", login);

    this.addGetRoute("/anonymous", anonymousLogin);

    this.addGetRoute("/demo", demoLogin);
  }
}
