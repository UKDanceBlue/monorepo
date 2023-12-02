import { AccessLevel, AuthSource, DbRole } from "@ukdanceblue/common";
import type { Context } from "koa";
import { DateTime } from "luxon";

import { makeUserJwt } from "../../../lib/auth/index.js";

export const anonymousLogin = (ctx: Context) => {
  let redirectTo = "/";
  const queryRedirectTo = Array.isArray(ctx.query.redirectTo)
    ? ctx.query.redirectTo[0]
    : ctx.query.redirectTo;
  if (queryRedirectTo && queryRedirectTo.length > 0) {
    redirectTo = queryRedirectTo;
  } else {
    return ctx.throw("Missing redirectTo query parameter", 400);
  }
  let setCookie = false;
  let sendToken = false;
  const returning = Array.isArray(ctx.query.returning)
    ? ctx.query.returning
    : [ctx.query.returning];
  if (returning.includes("cookie")) {
    setCookie = true;
  }
  if (returning.includes("token")) {
    sendToken = true;
  }

  const jwt = makeUserJwt({
    auth: {
      accessLevel: AccessLevel.Public,
      dbRole: DbRole.Public,
    },
    authSource: AuthSource.Anonymous,
  });
  if (setCookie) {
    ctx.cookies.set("token", jwt, {
      httpOnly: true,
      sameSite: "lax",
      expires: DateTime.utc().plus({ weeks: 2 }).toJSDate(),
    });
  }
  if (sendToken) {
    redirectTo = `${redirectTo}?token=${encodeURIComponent(jwt)}`;
  }
  return ctx.redirect(redirectTo);
};
