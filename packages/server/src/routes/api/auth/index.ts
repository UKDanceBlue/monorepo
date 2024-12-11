import { Service } from "@freshgum/typedi";
import { RequestHandler, urlencoded } from "express";

import { RouterService } from "#routes/RouteService.js";

import { anonymousLogin } from "./anonymous.js";
import { demoLogin } from "./demo.js";
import { login } from "./login.js";
import { oidcCallback } from "./oidcCallback.js";

// TODO: Replace custom OAuth2 + middleware implementation with Passport.js and oauth2orize
// https://www.passportjs.org
// https://github.com/jaredhanson/oauth2orize

const logout: RequestHandler = (req, res, next) => {
  try {
    res.clearCookie("token");

    let redirectTo = "/";
    const queryRedirectTo = Array.isArray(req.query.redirectTo)
      ? req.query.redirectTo[0]
      : req.query.redirectTo;
    if (queryRedirectTo && (queryRedirectTo as string).length > 0) {
      redirectTo = queryRedirectTo as string;
    }

    res.redirect(redirectTo);
  } catch (error) {
    next(error);
  }
};

@Service([])
export default class AuthRouter extends RouterService {
  constructor() {
    super("/auth");

    this.addGetRoute("/logout", logout);
    this.addPostRoute("/logout", logout);

    this.addPostRoute(
      "/oidc-callback",
      urlencoded({ extended: false }),
      oidcCallback
    );

    this.addGetRoute("/login", login);
    this.addPostRoute("/login", urlencoded({ extended: false }), login);

    this.addGetRoute("/anonymous", anonymousLogin);
    this.addPostRoute("/anonymous", anonymousLogin);

    this.addGetRoute("/demo", demoLogin);
    this.addPostRoute("/demo", demoLogin);
  }
}
