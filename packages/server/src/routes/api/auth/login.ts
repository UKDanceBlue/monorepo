import { makeOidcClient } from "./oidcClient.js";

import { LoginFlowSessionRepository } from "#repositories/LoginFlowSession.js";

import { generators } from "openid-client";
import { Container } from "@freshgum/typedi";

import type { Context } from "koa";

// TODO: convert to OAuth2
export const login = async (ctx: Context) => {
  const oidcClient = await makeOidcClient(ctx.request);

  const loginFlowSessionRepository = Container.get(LoginFlowSessionRepository);

  const queryRedirectTo = Array.isArray(ctx.query.redirectTo)
    ? ctx.query.redirectTo[0]
    : ctx.query.redirectTo;
  if (!queryRedirectTo || queryRedirectTo.length === 0) {
    return ctx.throw("Missing redirectTo query parameter", 400);
  }

  const returning = Array.isArray(ctx.query.returning)
    ? ctx.query.returning
    : [ctx.query.returning];

  const session = await loginFlowSessionRepository.startLoginFlow({
    redirectToAfterLogin: queryRedirectTo,
    setCookie: returning.includes("cookie"),
    sendToken: returning.includes("token"),
  });
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
