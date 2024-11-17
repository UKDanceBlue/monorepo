import { Container } from "@freshgum/typedi";
import type { Request, Response } from "express";
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
} from "openid-client";

import { serveOriginToken } from "@/lib/environmentTokens.js";
import { LoginFlowSessionRepository } from "@/repositories/LoginFlowSession.js";

import { oidcConfiguration } from "./oidcClient.js";

const serveOrigin = Container.get(serveOriginToken);

// TODO: convert to OAuth2
export const login = async (req: Request, res: Response): Promise<void> => {
  const loginFlowSessionRepository = Container.get(LoginFlowSessionRepository);

  const queryRedirectTo = Array.isArray(req.query.redirectTo)
    ? req.query.redirectTo[0]
    : req.query.redirectTo;
  if (!queryRedirectTo || queryRedirectTo.length === 0) {
    return void res.status(400).send("Missing redirectTo query parameter");
  }

  const returning = Array.isArray(req.query.returning)
    ? req.query.returning
    : [req.query.returning];

  const session = await loginFlowSessionRepository.startLoginFlow({
    redirectToAfterLogin: queryRedirectTo as string,
    setCookie: returning.includes("cookie"),
    sendToken: returning.includes("token"),
  });
  const codeChallenge = await calculatePKCECodeChallenge(session.codeVerifier);

  return res.redirect(
    buildAuthorizationUrl(oidcConfiguration, {
      scope: "openid email profile offline_access User.read",
      response_mode: "form_post",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state: session.uuid,
      redirect_uri: new URL("/api/auth/oidc-callback", serveOrigin).href,
    }).href
  );
};
