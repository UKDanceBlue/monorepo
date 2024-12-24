import { Container } from "@freshgum/typedi";
import { AuthSource, makeUserData } from "@ukdanceblue/common";
import type { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { DateTime } from "luxon";
import { authorizationCodeGrant } from "openid-client";

import { makeUserJwt } from "#auth/index.js";
import { getHostUrl } from "#lib/host.js";
import { LoginFlowSessionRepository } from "#repositories/LoginFlowSession.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

import { oidcConfiguration } from "./oidcClient.js";

export const oidcCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let sessionDeleted = true;

  const personRepository = Container.get(PersonRepository);
  const loginFlowSessionRepository = Container.get(LoginFlowSessionRepository);

  let flowSessionId;
  try {
    if (typeof req.body === "object" && "state" in req.body) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      flowSessionId = req.body.state;
    } else {
      throw new Error("Missing state parameter");
    }

    if (!flowSessionId) {
      return void res.status(400).send("Missing state parameter");
    }

    sessionDeleted = false;

    const session =
      await loginFlowSessionRepository.findLoginFlowSessionByUnique({
        uuid: flowSessionId,
      });
    if (!session?.codeVerifier) {
      throw new Error(
        `No ${session == null ? "session" : "codeVerifier"} found`
      );
    }
    const query = new URLSearchParams(
      req.body as Record<string, string | readonly string[]>
    );

    const currentUrl = getHostUrl(req);
    currentUrl.pathname = `/api/auth/oidc-callback`;
    currentUrl.search = query.toString();

    // Perform OIDC validation
    let tokenSet;
    try {
      tokenSet = await authorizationCodeGrant(oidcConfiguration, currentUrl, {
        pkceCodeVerifier: session.codeVerifier,
        expectedState: flowSessionId,
        idTokenExpected: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        if ("error_description" in error) {
          error.message = String(error.error_description);
        } else if ("code" in error) {
          error.message += ` (${String(error.code)})`;
        }
      }
      throw error;
    }
    // Destroy the session
    await loginFlowSessionRepository.completeLoginFlow({
      uuid: flowSessionId,
    });
    sessionDeleted = true;
    if (!tokenSet.access_token) {
      throw new Error("Missing access token");
    }
    const idTokenData = tokenSet.claims();
    if (!idTokenData) {
      throw new Error("Missing ID token data");
    }
    const { oid: objectId, email } = idTokenData;
    const decodedJwt = jsonwebtoken.decode(tokenSet.access_token, {
      json: true,
    });
    if (!decodedJwt) {
      throw new Error("Error decoding JWT");
    }
    const {
      given_name: firstName,
      family_name: lastName,
      upn: userPrincipalName,
    } = decodedJwt;
    let linkblue: null | string = null;
    if (
      typeof userPrincipalName === "string" &&
      userPrincipalName.endsWith("@uky.edu")
    ) {
      linkblue = userPrincipalName.replace(/@uky\.edu$/, "").toLowerCase();
    }
    if (typeof objectId !== "string") {
      return void res.status(500).send("Missing OID");
    }
    const findPersonForLoginResult = await personRepository.findPersonForLogin(
      [[AuthSource.LinkBlue, objectId]],
      { email: String(email), linkblue }
    );

    if (findPersonForLoginResult.isErr()) {
      return void res
        .status(500)
        .send(
          findPersonForLoginResult.error.expose
            ? findPersonForLoginResult.error.message
            : "Error finding person"
        );
    }
    const { currentPerson } = findPersonForLoginResult.value;

    if (
      !currentPerson.authIdPairs.some(
        ({ source, value }) =>
          source === AuthSource.LinkBlue && value === objectId
      )
    ) {
      currentPerson.authIdPairs = [
        ...currentPerson.authIdPairs,
        {
          personId: currentPerson.id,
          source: AuthSource.LinkBlue,
          value: objectId,
        },
      ];
    }
    if (email && currentPerson.email !== email && typeof email === "string") {
      currentPerson.email = email;
    }
    if (typeof firstName === "string" && typeof lastName === "string") {
      const name = `${firstName} ${lastName}`;
      if (currentPerson.name !== name) {
        currentPerson.name = name;
      }
    }
    if (linkblue && currentPerson.linkblue !== linkblue) {
      currentPerson.linkblue = linkblue.toLowerCase();
    }

    const updatedPerson = await personRepository.updatePerson(
      { id: currentPerson.id },
      {
        name: currentPerson.name,
        email: currentPerson.email,
        linkblue: currentPerson.linkblue?.toLowerCase(),
        authIds: currentPerson.authIdPairs.map((a) => ({
          source: a.source,
          value: a.value,
        })),
      }
    );

    if (updatedPerson.isErr()) {
      return void res.status(500).send("Failed to update database entry");
    }

    const personNode = personModelToResource(updatedPerson.value);
    if (personNode.isErr()) {
      return void res
        .status(500)
        .send(
          personNode.error.expose
            ? personNode.error.message
            : "Error creating person node"
        );
    }
    const jwt = makeUserJwt(
      makeUserData(personNode.value, AuthSource.LinkBlue)
    );
    let redirectTo = session.redirectToAfterLogin;
    if (session.sendToken) {
      redirectTo = `${redirectTo}?token=${encodeURIComponent(jwt)}`;
    }
    if (session.setCookie) {
      res.cookie("token", jwt, {
        httpOnly: true,
        sameSite: req.secure ? "none" : "lax",
        secure: req.secure,
        expires: DateTime.now().plus({ days: 7 }).toJSDate(),
      });
    }
    return res.redirect(redirectTo);
  } catch (error) {
    res.clearCookie("token");
    next(error);
  } finally {
    if (!sessionDeleted) {
      await loginFlowSessionRepository.completeLoginFlow({
        uuid: flowSessionId,
      });
    }
  }
};
