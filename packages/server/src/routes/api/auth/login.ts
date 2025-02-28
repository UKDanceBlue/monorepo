import { AuthSource } from "@ukdanceblue/common";
import { ErrorCode } from "@ukdanceblue/common/error";
import type { NextFunction, Request, Response } from "express";
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
} from "openid-client";
import { AsyncResult } from "ts-results-es";

import { getHostUrl } from "#lib/host.js";
import { LoginFlowRepository } from "#repositories/LoginFlowSession.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { SessionRepository } from "#repositories/Session.js";

import { oidcConfiguration } from "./oidcClient.js";

function getStringQueryParameter(
  req: Request,
  key: string
): string | undefined {
  let queryValue = req.query[key];
  if (Array.isArray(queryValue)) {
    queryValue = queryValue[0];
  }
  return queryValue?.toString() || undefined;
}

// TODO: convert to OAuth2
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!oidcConfiguration) {
    res.status(503).json({
      error: {
        message: "OIDC configuration not available",
      },
    });
    return;
  }

  try {
    const loginFlowSessionRepository = req.getService(LoginFlowRepository);

    const redirectTo = getStringQueryParameter(req, "redirectTo");
    if (!redirectTo) {
      return void res.status(400).send("Missing redirectTo query parameter");
    }

    const returning = Array.isArray(req.query.returning)
      ? req.query.returning
      : [req.query.returning];

    const { email, password } = req.body ?? {};

    if (typeof email === "string" && typeof password === "string") {
      // email/password login
      if (req.method === "GET") {
        return void res.status(405).send("Method Not Allowed");
      }

      const personRepository = req.getService(PersonRepository);
      const sessionRepository = req.getService(SessionRepository);
      const person = await new AsyncResult(
        personRepository.passwordLogin(email, password)
      ).andThen((person) => personModelToResource(person, personRepository))
        .promise;

      if (person.isErr()) {
        if (
          person.error.tag === ErrorCode.Unauthenticated ||
          person.error.tag === ErrorCode.NotFound
        ) {
          return void res.status(401).send("Invalid email or password");
        } else {
          return next(person.error);
        }
      } else {
        const jwt = await sessionRepository
          .newSession({
            user: {
              uuid: person.value.id.id,
            },
            authSource: AuthSource.Password,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
          })
          .andThen((session) => sessionRepository.signSession(session)).promise;
        if (jwt.isErr()) {
          next(jwt.error);
        } else {
          return sessionRepository.doExpressRedirect(
            req,
            res,
            jwt.value,
            redirectTo,
            returning
          );
        }
      }
    } else {
      // OIDC login
      const session = await loginFlowSessionRepository.startLoginFlow({
        redirectToAfterLogin: redirectTo,
        setCookie: returning.includes("cookie"),
        sendToken: returning.includes("token"),
      });
      const codeChallenge = await calculatePKCECodeChallenge(
        session.codeVerifier
      );

      return res.redirect(
        buildAuthorizationUrl(oidcConfiguration, {
          scope: "openid email profile offline_access User.read",
          response_mode: "form_post",
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
          state: session.uuid,
          redirect_uri: new URL("/api/auth/oidc-callback", getHostUrl(req))
            .href,
        }).href
      );
    }
  } catch (error) {
    res.clearCookie("token");
    next(error);
  }
};
