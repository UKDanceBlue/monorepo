import { Container } from "@freshgum/typedi";
import type { Request, Response } from "express";
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
} from "openid-client";

import { LoginFlowSessionRepository } from "#repositories/LoginFlowSession.js";

import { makeOidcClient } from "./oidcClient.js";

// TODO: convert to OAuth2
export const login = async (req: Request, res: Response): Promise<void> => {
  const oidcClient = await makeOidcClient(req);

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
    buildAuthorizationUrl(oidcClient, {
      scope: "openid email profile offline_access User.read",
      response_mode: "form_post",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      state: session.uuid,
    }).href
  );
};
