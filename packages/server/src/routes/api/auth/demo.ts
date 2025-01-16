import { AuthSource } from "@ukdanceblue/common";
import type { NextFunction, Request, Response } from "express";

import { getOrMakeDemoUser } from "#lib/demo.js";
import { SessionRepository } from "#repositories/Session.js";

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
    const returning = Array.isArray(req.query.returning)
      ? req.query.returning
      : [req.query.returning];

    const person = await getOrMakeDemoUser();
    if (person.isErr()) {
      return next(person.error);
    }

    const sessionRepository = req.getService(SessionRepository);
    const jwt = await sessionRepository
      .newSession({
        user: {
          id: person.value.id,
        },
        authSource: AuthSource.Demo,
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
  } catch (error) {
    res.clearCookie("token");
    next(error);
  }
};
