import { AuthSource } from "@ukdanceblue/common";
import type { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";

import { makeUserJwt } from "#auth/index.js";

export const anonymousLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let redirectTo = "/";
    const queryRedirectTo = Array.isArray(req.query.redirectTo)
      ? req.query.redirectTo[0]
      : req.query.redirectTo;
    if (queryRedirectTo && (queryRedirectTo as string).length > 0) {
      redirectTo = queryRedirectTo as string;
    } else {
      return void res.status(400).send("Missing redirectTo query parameter");
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

    const jwt = makeUserJwt({
      authSource: AuthSource.Anonymous,
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
