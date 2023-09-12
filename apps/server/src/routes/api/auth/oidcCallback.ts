import { AuthSource } from "@ukdanceblue/db-app-common";
import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jsonwebtoken from "jsonwebtoken";

import { LoginFlowSessionModel } from "../../.././models/LoginFlowSession.js";
import { findPersonForLogin } from "../../../controllers/PersonController.js";
import { makeUserJwt } from "../../../lib/auth/index.js";
import { PersonIntermediate } from "../../../models/Person.js";

export const oidcCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.oidcClient) {
    throw new createHttpError.InternalServerError("Missing OIDC client");
  }

  const parameters = res.locals.oidcClient.callbackParams(req);
  const flowSessionId = parameters.state;

  if (flowSessionId == null) {
    return next(createHttpError.BadRequest());
  }

  let sessionDeleted = false;

  try {
    const session = await LoginFlowSessionModel.findOne({
      where: {
        uuid: flowSessionId,
      },
    });
    if (!session?.codeVerifier) {
      throw new createHttpError.InternalServerError(
        `No ${session == null ? "session" : "codeVerifier"} found`
      );
    }
    // Perform OIDC validation
    const tokenSet = await res.locals.oidcClient.callback(
      new URL("/api/auth/oidc-callback", res.locals.applicationUrl).toString(),
      parameters,
      { code_verifier: session.codeVerifier, state: flowSessionId }
    );
    // Destroy the session
    await session.destroy();
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
      return next(createHttpError.InternalServerError("Missing OID"));
    }
    const [currentPerson, didCreate] = await findPersonForLogin(
      { [AuthSource.UkyLinkblue]: objectId },
      { email, linkblue }
    );
    let isPersonChanged = didCreate;
    if (currentPerson.authIds[AuthSource.UkyLinkblue] !== objectId) {
      currentPerson.authIds[AuthSource.UkyLinkblue] = objectId;
      isPersonChanged = true;
    }
    if (email && currentPerson.email !== email) {
      currentPerson.email = email;
      isPersonChanged = true;
    }
    if (
      typeof firstName === "string" &&
      currentPerson.firstName !== firstName
    ) {
      currentPerson.firstName = firstName;
      isPersonChanged = true;
    }
    if (typeof lastName === "string" && currentPerson.lastName !== lastName) {
      currentPerson.lastName = lastName;
      isPersonChanged = true;
    }
    if (linkblue && currentPerson.linkblue !== linkblue) {
      currentPerson.linkblue = linkblue;
      isPersonChanged = true;
    }
    if (isPersonChanged) {
      await currentPerson.save();
    }
    const userData = new PersonIntermediate(currentPerson).toUserData();
    res.locals = {
      ...res.locals,
      user: userData,
    };
    const jwt = makeUserJwt(userData, AuthSource.UkyLinkblue);
    res.cookie("token", jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    return res.redirect(session.redirectToAfterLogin ?? "/");
  } catch (error) {
    if (!sessionDeleted) {
      // const sessionRepository = appDataSource.getRepository(LoginFlowSession);
      // sessionRepository.delete({ sessionId: flowSessionId }).catch(logCritical);
    }
    return next(error);
  }
};
