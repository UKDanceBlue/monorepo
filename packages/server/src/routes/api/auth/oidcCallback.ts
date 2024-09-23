import { makeOidcClient } from "./oidcClient.js";

import { makeUserJwt } from "#auth/index.js";
import { LoginFlowSessionRepository } from "#repositories/LoginFlowSession.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";

import { AuthSource, makeUserData } from "@ukdanceblue/common";
import jsonwebtoken from "jsonwebtoken";
import { DateTime } from "luxon";
import { Container } from "@freshgum/typedi";

import type { Context } from "koa";
import type { IncomingMessage } from "node:http";

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

  let sessionDeleted = false;

  const personRepository = Container.get(PersonRepository);
  const loginFlowSessionRepository = Container.get(LoginFlowSessionRepository);

  try {
    const session =
      await loginFlowSessionRepository.findLoginFlowSessionByUnique({
        uuid: flowSessionId,
      });
    if (!session?.codeVerifier) {
      throw new Error(
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
      throw new Error("Missing access token");
    }
    const { oid: objectId, email } = tokenSet.claims();
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
      return ctx.throw("Missing OID", 500);
    }
    const findPersonForLoginResult = await personRepository.findPersonForLogin(
      [[AuthSource.LinkBlue, objectId]],
      { email, linkblue }
    );

    if (findPersonForLoginResult.isErr()) {
      return ctx.throw(
        findPersonForLoginResult.error.expose
          ? findPersonForLoginResult.error.message
          : "Error finding person",
        500
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
      currentPerson.linkblue = linkblue?.toLowerCase();
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
      return ctx.throw("Failed to update database entry", 500);
    }

    const personNode = await personModelToResource(
      updatedPerson.value,
      personRepository
    ).promise;
    if (personNode.isErr()) {
      return ctx.throw(
        personNode.error.expose
          ? personNode.error.message
          : "Error creating person node",
        500
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
      ctx.cookies.set("token", jwt, {
        httpOnly: true,
        sameSite: ctx.secure ? "none" : "lax",
        secure: ctx.secure,
        expires: DateTime.now().plus({ days: 7 }).toJSDate(),
      });
    }
    return ctx.redirect(redirectTo);
  } finally {
    if (!sessionDeleted) {
      await loginFlowSessionRepository.completeLoginFlow({
        uuid: flowSessionId,
      });
    }
  }
};
