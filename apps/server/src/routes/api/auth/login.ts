import type { InferCreationAttributes } from "@sequelize/core";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import type { LoginFlowSessionModel } from "../../.././models/LoginFlowSession.js";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
  // eslint-disable-next-line @typescript-eslint/require-await
) => {
  try {
    if (!res.locals.oidcClient) {
      return next(createHttpError.InternalServerError("Missing OIDC client"));
    }

    // Figure out where to redirect to after login
    const loginFlowSessionInitializer: Partial<
      InferCreationAttributes<LoginFlowSessionModel>
    > = {};
    const { host: hostHeader, referer: hostReferer } = req.headers;
    const host = hostHeader
      ? new URL(`https://${hostHeader}`).host
      : res.locals.applicationUrl.host;
    if (hostReferer && hostReferer.length > 0) {
      const referer = new URL(hostReferer);
      if (referer.host === host) {
        loginFlowSessionInitializer.redirectToAfterLogin = referer.pathname;
      }
    }

    // const sessionRepository = appDataSource.getRepository(LoginFlowSession);
    // const session = await sessionRepository.save(
    //   sessionRepository.create(loginFlowSessionInitializer)
    // );
    // const codeChallenge = generators.codeChallenge(session.codeVerifier);
    return res.redirect(
      res.locals.oidcClient.authorizationUrl({
        scope: "openid email profile offline_access User.read",
        response_mode: "form_post",
        // code_challenge: codeChallenge,
        code_challenge_method: "S256",
        // state: session.sessionId,
      })
    );
  } catch (error) {
    return next(error);
  }
};
