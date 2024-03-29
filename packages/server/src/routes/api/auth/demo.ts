import {
  AccessLevel,
  AuthSource,
  DbRole,
  MembershipPositionType,
} from "@ukdanceblue/common";
import type { Context } from "koa";
import { DateTime } from "luxon";

import { makeUserJwt } from "../../../lib/auth/index.js";
import { getOrMakeDemoUser } from "../../../lib/demo.js";

export const demoLogin = async (ctx: Context) => {
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

  const person = await getOrMakeDemoUser();

  const jwt = makeUserJwt({
    auth: {
      accessLevel: AccessLevel.UKY,
      dbRole: DbRole.UKY,
    },
    userId: person.uuid,
    teamIds: person.memberships.map((m) => m.team.uuid),
    captainOfTeamIds: person.memberships
      .filter((m) => m.position === MembershipPositionType.Captain)
      .map((m) => m.team.uuid),
    authSource: AuthSource.Demo,
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
