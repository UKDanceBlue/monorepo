import { AuthSource, type PersonNode } from "@ukdanceblue/common";
import {
  type ExtendedError,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import type { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { authorizationCodeGrant, type JsonValue } from "openid-client";
import { Err, type Result } from "ts-results-es";

import { getHostUrl } from "#lib/host.js";
import { LoginFlowRepository } from "#repositories/LoginFlowSession.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { SessionRepository } from "#repositories/Session.js";

import { oidcConfiguration } from "./oidcClient.js";

export const oidcCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!oidcConfiguration.configuration) {
    res.status(503).json({
      error: {
        message: "OIDC configuration not available",
      },
    });
    return;
  }

  let sessionDeleted = true;

  const personRepository = req.getService(PersonRepository);
  const loginFlowRepository = req.getService(LoginFlowRepository);
  const sessionRepository = req.getService(SessionRepository);

  let flowSessionId;
  try {
    if (typeof req.body === "object" && "state" in req.body) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      flowSessionId = req.body.state;
    } else {
      return void res.status(400).json({ message: "Missing state parameter" });
    }
    if (!flowSessionId) {
      return void res.status(400).json({ message: "Missing state parameter" });
    }

    sessionDeleted = false;

    const loginFlow = await loginFlowRepository.findLoginFlowSessionByUnique({
      uuid: flowSessionId,
    });
    if (!loginFlow?.codeVerifier) {
      throw new Error(
        `No ${loginFlow == null ? "session" : "codeVerifier"} found`
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
      tokenSet = await authorizationCodeGrant(
        oidcConfiguration.configuration,
        currentUrl,
        {
          pkceCodeVerifier: loginFlow.codeVerifier,
          expectedState: flowSessionId,
          idTokenExpected: true,
        }
      );
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
    await loginFlowRepository.completeLoginFlow({
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

    const personNodeResult = await getPersonFromAzureJwt(
      decodedJwt,
      objectId,
      email,
      personRepository
    );

    if (personNodeResult.isErr()) {
      next(personNodeResult.error);
    } else {
      const jwt = await sessionRepository
        .newSession({
          user: {
            uuid: personNodeResult.value.id.id,
          },
          authSource: AuthSource.LinkBlue,
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
          loginFlow.redirectToAfterLogin,
          [
            loginFlow.sendToken ? "token" : undefined,
            loginFlow.setCookie ? "cookie" : undefined,
          ]
        );
      }
    }
  } catch (error) {
    res.clearCookie("token");
    next(error);
  } finally {
    if (!sessionDeleted) {
      await loginFlowRepository.completeLoginFlow({
        uuid: flowSessionId,
      });
    }
  }
};

async function getPersonFromAzureJwt(
  decodedJwt: jsonwebtoken.JwtPayload,
  objectId: JsonValue | undefined,
  email: JsonValue | undefined,
  personRepository: PersonRepository
): Promise<Result<PersonNode, ExtendedError>> {
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
    return Err(new InvalidArgumentError("Missing OID in JWT"));
  }
  const findPersonForLoginResult = await personRepository.findPersonForLogin(
    [[AuthSource.LinkBlue, objectId]],
    { email: String(email), linkblue }
  );

  if (findPersonForLoginResult.isErr()) {
    return findPersonForLoginResult;
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
    return updatedPerson;
  }

  const personNode = await personModelToResource(
    updatedPerson.value,
    personRepository
  ).promise;
  return personNode;
}
