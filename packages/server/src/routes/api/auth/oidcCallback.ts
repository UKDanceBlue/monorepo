import type { IncomingMessage } from "node:http";

import {
  AuthSource,
  MembershipPositionType,
  makeUserData,
} from "@ukdanceblue/common";
import createHttpError from "http-errors";
import jsonwebtoken from "jsonwebtoken";
import type { Context } from "koa";
import { DateTime } from "luxon";
import { Container } from "typedi";

import { sequelizeDb } from "../../../data-source.js";
import { makeUserJwt } from "../../../lib/auth/index.js";
import { PersonRepository } from "../../../repositories/person/PersonRepository.js";
import { personModelToResource } from "../../../repositories/person/personModelToResource.js";
import { LoginFlowSessionRepository } from "../../../resolvers/LoginFlowSession.js";

import { makeOidcClient } from "./oidcClient.js";

export const oidcCallback = async (ctx: Context) => {
  const oidcClient = await makeOidcClient(ctx.request);

  const parameters = oidcClient.callbackParams(
    // This is alright because callbackParams only uses the body and method properties, if this changes, we'll need to do something else
    ctx.request as unknown as IncomingMessage
  );
  const flowSessionId = parameters.state;

  if (!flowSessionId) {
    return ctx.throw("Missing state parameter", 400);
  }

  let sessionDeleted: boolean = false;

  const personRepository = Container.get(PersonRepository);
  const loginFlowSessionRepository = Container.get(LoginFlowSessionRepository);

  try {
    await sequelizeDb.transaction(async () => {
      const session =
        await loginFlowSessionRepository.findLoginFlowSessionByUnique({
          uuid: flowSessionId,
        });
      if (!session?.codeVerifier) {
        throw new createHttpError.InternalServerError(
          `No ${session == null ? "session" : "codeVerifier"} found`
        );
      }
      // Perform OIDC validation
      const tokenSet = await oidcClient.callback(
        new URL("/api/auth/oidc-callback", ctx.request.URL).toString(),
        parameters,
        { code_verifier: session.codeVerifier, state: flowSessionId }
      );
      // Destroy the session
      await loginFlowSessionRepository.completeLoginFlow({
        uuid: flowSessionId,
      });
      sessionDeleted = true;
      if (!tokenSet.access_token) {
        throw new createHttpError.InternalServerError("Missing access token");
      }
      const { oid: objectId, email } = tokenSet.claims();
      const decodedJwt = jsonwebtoken.decode(tokenSet.access_token, {
        json: true,
      });
      if (!decodedJwt) {
        throw new createHttpError.InternalServerError("Error decoding JWT");
      }
      const {
        given_name: firstName,
        family_name: lastName,
        upn: userPrincipalName,
      } = decodedJwt;
      let linkblue = null;
      if (
        typeof userPrincipalName === "string" &&
        userPrincipalName.endsWith("@uky.edu")
      ) {
        linkblue = userPrincipalName.replace(/@uky\.edu$/, "");
      }
      if (typeof objectId !== "string") {
        return ctx.throw("Missing OID", 500);
      }
      const [currentPerson] = await personRepository.findPersonForLogin(
        [[AuthSource.LinkBlue, objectId]],
        { email, linkblue }
      );

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
      if (email && currentPerson.email !== email) {
        currentPerson.email = email;
      }
      if (typeof firstName === "string" && typeof lastName === "string") {
        const name = `${firstName} ${lastName}`;
        if (currentPerson.name !== name) {
          currentPerson.name = name;
        }
      }
      if (linkblue && currentPerson.linkblue !== linkblue) {
        currentPerson.linkblue = linkblue;
      }

      const updatedPerson = await personRepository.updatePerson(
        { id: currentPerson.id },
        {
          name: currentPerson.name,
          email: currentPerson.email,
          linkblue: currentPerson.linkblue,
          committeeName: currentPerson.committeeName,
          committeeRole: currentPerson.committeeRole,
          authIds: currentPerson.authIdPairs.map((a) => ({
            source: a.source,
            value: a.value,
          })),
        }
      );

      if (!updatedPerson) {
        return ctx.throw("Failed to update database entry", 500);
      }

      const jwt = makeUserJwt(
        makeUserData(
          personModelToResource(updatedPerson),
          AuthSource.LinkBlue,
          currentPerson.memberships.map((m) => m.team.uuid),
          currentPerson.memberships
            .filter((m) => m.position === MembershipPositionType.Captain)
            .map((m) => m.team.uuid)
        )
      );
      let redirectTo = session.redirectToAfterLogin;
      if (session.sendToken) {
        redirectTo = `${redirectTo}?token=${encodeURIComponent(jwt)}`;
      }
      if (session.setCookie) {
        ctx.cookies.set("token", jwt, {
          httpOnly: true,
          sameSite: ctx.secure ? "none" : "lax",
          secure: ctx.secure,
          expires: DateTime.now().plus({ days: 7 }).toJSDate(),
        });
      }
      return ctx.redirect(redirectTo);
    });
  } finally {
    if (!(sessionDeleted as true | typeof sessionDeleted)) {
      await loginFlowSessionRepository.completeLoginFlow({
        uuid: flowSessionId,
      });
    }
  }
};
