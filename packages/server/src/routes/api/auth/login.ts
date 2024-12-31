import { Container } from "@freshgum/typedi";
import { AuthSource } from "@ukdanceblue/common";
import { ErrorCode } from "@ukdanceblue/common/error";
import type { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
} from "openid-client";
import { AsyncResult } from "ts-results-es";

import { makeUserJwt } from "#auth/index.js";
import { getHostUrl } from "#lib/host.js";
import { LoginFlowSessionRepository } from "#repositories/LoginFlowSession.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

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
  try {
    const loginFlowSessionRepository = Container.get(
      LoginFlowSessionRepository
    );

    const queryRedirectTo = getStringQueryParameter(req, "redirectTo");
    if (!queryRedirectTo) {
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

      const personRepository = Container.get(PersonRepository);
      const person = await new AsyncResult(
        personRepository.passwordLogin(email, password)
      ).andThen((person) => personModelToResource(person, personRepository))
        .promise;

      if (person.isErr()) {
        return person.error.tag === ErrorCode.Unauthenticated ||
          person.error.tag === ErrorCode.NotFound
          ? void res.status(401).send("Invalid email or password")
          : void res.sendStatus(500);
      } else {
        const jwt = makeUserJwt({
          authSource: AuthSource.Password,
          userId: person.value.id.id,
        });
        let redirectTo = queryRedirectTo;
        if (returning.includes("token")) {
          redirectTo = `${redirectTo}?token=${encodeURIComponent(jwt)}`;
        }
        if (returning.includes("cookie")) {
          res.cookie("token", jwt, {
            httpOnly: true,
            sameSite: req.secure ? "none" : "lax",
            secure: req.secure,
            expires: DateTime.now().plus({ days: 7 }).toJSDate(),
          });
        }
        return res.redirect(redirectTo);
      }
    } else {
      // OIDC login
      const session = await loginFlowSessionRepository.startLoginFlow({
        redirectToAfterLogin: queryRedirectTo,
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
