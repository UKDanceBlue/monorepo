import { AuthSource } from "@ukdanceblue/common";
import type { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";

import { makeUserJwt } from "#auth/index.js";
import { getOrMakeDemoUser } from "#lib/demo.js";

export const demoLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let redirectTo = "/";
    const queryRedirectTo = Array.isArray(req.query.redirectTo)
      ? req.query.redirectTo[0]
      : req.query.redirectTo;
    if (queryRedirectTo && (queryRedirectTo as string).length > 0) {
      redirectTo = queryRedirectTo as string;
    } else {
      res.status(400);
      return void res.send("Missing redirectTo query parameter");
    }
    let setCookie = false;
    let sendToken = false;
    const returning = Array.isArray(req.query.returning)
      ? req.query.returning
      : [req.query.returning];
    if (returning.includes("cookie")) {
      setCookie = true;
    }
    if (returning.includes("token")) {
      sendToken = true;
    }

    const person = await getOrMakeDemoUser();
    if (person.isErr()) {
      res.status(500);
      return void res.send(
        person.error.expose ? person.error.message : "Error creating demo user"
      );
    }

    const jwt = makeUserJwt({
      userId: person.value.uuid,
      authSource: AuthSource.Demo,
    });
    if (setCookie) {
      res.cookie("token", jwt, {
        httpOnly: true,
        sameSite: "lax",
        expires: DateTime.utc().plus({ weeks: 2 }).toJSDate(),
      });
    }
    if (sendToken) {
      redirectTo = `${redirectTo}?token=${encodeURIComponent(jwt)}`;
    }
    return res.redirect(redirectTo);
  } catch (error) {
    res.clearCookie("token");
    next(error);
  }
};
