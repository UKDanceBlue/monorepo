import type { InferCreationAttributes } from "@sequelize/core";
import type { Context } from "koa";
import { generators } from "openid-client";

import { makeOidcClient } from "./oidcClient.js";

// TODO: convert to OAuth2
export const login = async (ctx: Context) => {
  const oidcClient = await makeOidcClient(ctx.request);

  // Figure out where to redirect to after login
  const loginFlowSessionInitializer: Partial<
    InferCreationAttributes<LoginFlowSessionModel>
  > = {};

  const queryRedirectTo = Array.isArray(ctx.query.redirectTo)
    ? ctx.query.redirectTo[0]
    : ctx.query.redirectTo;
  if (queryRedirectTo && queryRedirectTo.length > 0) {
    loginFlowSessionInitializer.redirectToAfterLogin = queryRedirectTo;
  } else {
    return ctx.throw("Missing redirectTo query parameter", 400);
  }
  const returning = Array.isArray(ctx.query.returning)
    ? ctx.query.returning
    : [ctx.query.returning];
  if (returning.includes("cookie")) {
    loginFlowSessionInitializer.setCookie = true;
  }
  if (returning.includes("token")) {
    loginFlowSessionInitializer.sendToken = true;
  }

  const session = await LoginFlowSessionModel.create(
    loginFlowSessionInitializer
  );
  const codeChallenge = generators.codeChallenge(session.codeVerifier);
  return ctx.redirect(
    oidcClient.authorizationUrl({
      scope: "openid email profile offline_access User.read",
      response_mode: "form_post",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state: session.uuid,
    })
  );
};
