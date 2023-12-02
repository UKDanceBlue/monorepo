import type { Authorization, JwtPayload, UserData } from "@ukdanceblue/common";
import {
  AccessLevel,
  AuthSource,
  CommitteeRole,
  DbRole,
  defaultAuthorization,
} from "@ukdanceblue/common";
import type { Request } from "express";
import jsonwebtoken from "jsonwebtoken";

import { jwtSecret } from "../../environment.js";

/**
 * Compares an authorization object to a minimum authorization object
 * and returns true if the authorization object satisfies the minimum
 * authorization object (i.e. the authorization object has at least
 * the same authorization as the minimum authorization object)
 *
 * @param minAuth The minimum authorization object
 * @param auth The authorization object to compare to the minimum authorization object
 * @return True if the authorization object satisfies the minimum authorization object
 *        and false otherwise
 */
export function isMinAuthSatisfied(
  minAuth: Authorization,
  auth: Authorization
): boolean {
  if (auth.accessLevel < minAuth.accessLevel) {
    return false;
  }
  if (minAuth.committeeRole && auth.committeeRole !== minAuth.committeeRole) {
    return false;
  }
  if (
    minAuth.committeeIdentifier &&
    auth.committeeIdentifier !== minAuth.committeeIdentifier
  ) {
    return false;
  }
  return true;
}

export const simpleAuthorizations: Record<AccessLevel, Authorization> = {
  [AccessLevel.None]: defaultAuthorization,
  [AccessLevel.Public]: {
    dbRole: DbRole.Public,
    accessLevel: AccessLevel.Public,
  },
  [AccessLevel.TeamMember]: {
    dbRole: DbRole.TeamMember,
    accessLevel: AccessLevel.TeamMember,
  },
  [AccessLevel.TeamCaptain]: {
    dbRole: DbRole.TeamCaptain,
    accessLevel: AccessLevel.TeamCaptain,
  },
  [AccessLevel.Committee]: {
    dbRole: DbRole.Committee,
    accessLevel: AccessLevel.Committee,
  },
  [AccessLevel.CommitteeChairOrCoordinator]: {
    dbRole: DbRole.Committee,
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  },
  [AccessLevel.Admin]: {
    dbRole: DbRole.Committee,
    accessLevel: AccessLevel.Admin,
  },
};

const jwtIssuer = "https://app.danceblue.org";

/**
 * @param payload The payload to check
 * @return Whether the payload is a valid JWT payload
 */
export function isValidJwtPayload(payload: unknown): payload is JwtPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const {
    sub,
    auth_source,
    dbRole,
    committee_role,
    committee,
    access_level,
    team_ids,
    captain_of_team_ids,
  } = payload as Record<keyof JwtPayload, unknown>;
  if (typeof sub !== "string") {
    return false;
  }
  if (!Object.values(AuthSource).includes(auth_source as AuthSource)) {
    return false;
  }
  if (
    typeof dbRole !== "string" ||
    !Object.values(DbRole).includes(dbRole as DbRole)
  ) {
    return false;
  }
  if (
    committee_role !== undefined &&
    (typeof committee_role !== "string" ||
      !Object.values(CommitteeRole).includes(committee_role as CommitteeRole))
  ) {
    return false;
  }
  if (committee !== undefined && typeof committee !== "string") {
    return false;
  }
  if (
    typeof access_level !== "number" ||
    !Object.values(AccessLevel).includes(access_level as AccessLevel)
  ) {
    return false;
  }
  if (team_ids !== undefined && !Array.isArray(team_ids)) {
    return false;
  }
  if (
    captain_of_team_ids !== undefined &&
    !Array.isArray(captain_of_team_ids)
  ) {
    return false;
  }
  return true;
}

/**
 * Mints a JWT for the given user data
 *
 * @param user The user data to mint a JWT for
 * @param source The source of the user's authorization
 * @return The JWT, containing the user's authorization data
 */
export function makeUserJwt(user: UserData): string {
  const payload: JwtPayload = {
    auth_source: user.authSource,
    dbRole: user.auth.dbRole,
    access_level: user.auth.accessLevel,
  };

  if (user.userId) {
    payload.sub = user.userId;
  }
  if (user.auth.committeeRole) {
    payload.committee_role = user.auth.committeeRole;
  }
  if (user.auth.committeeIdentifier) {
    payload.committee = user.auth.committeeIdentifier;
  }
  if (user.teamIds) {
    payload.team_ids = user.teamIds;
  }
  if (user.captainOfTeamIds) {
    payload.captain_of_team_ids = user.captainOfTeamIds;
  }

  return jsonwebtoken.sign(payload, jwtSecret, {
    issuer: jwtIssuer,
    expiresIn: "1d",
  });
}

/**
 * Parses a JWT into user data
 *
 * @param token The JWT to parse
 * @return The user data contained in the JWT
 */
export function parseUserJwt(token: string): UserData {
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set");
  }

  const payload = jsonwebtoken.verify(token, jwtSecret, {
    issuer: jwtIssuer,
  });

  if (!isValidJwtPayload(payload)) {
    throw new Error("Invalid JWT payload");
  }

  if (
    payload.auth_source === AuthSource.Anonymous &&
    payload.access_level > AccessLevel.Public
  ) {
    throw new jsonwebtoken.JsonWebTokenError(
      "Anonymous users cannot have access levels greater than public"
    );
  }

  const userData: UserData = {
    auth: {
      accessLevel: payload.access_level,
      dbRole: payload.dbRole,
    },
    authSource: payload.auth_source,
  };

  if (payload.sub) {
    userData.userId = payload.sub;
  }
  if (payload.committee_role) {
    userData.auth.committeeRole = payload.committee_role;
  }
  if (payload.committee) {
    userData.auth.committeeIdentifier = payload.committee;
  }
  if (payload.team_ids) {
    userData.teamIds = payload.team_ids;
  }
  if (payload.captain_of_team_ids) {
    userData.captainOfTeamIds = payload.captain_of_team_ids;
  }

  return userData;
}

/**
 * Parses a JWT from a request
 *
 * @param req The request to parse the JWT from
 * @return The JWT, or undefined if no JWT was found and any error messages
 */
export function tokenFromRequest(
  req: Request
): [string | undefined, "invalid-header" | "not-bearer" | "unknown" | null] {
  try {
    // Prefer cookie
    let jsonWebToken: string | undefined = undefined;
    const cookies = req.cookies as unknown;
    if (
      typeof cookies === "object" &&
      cookies &&
      typeof (cookies as { token: unknown }).token === "string"
    ) {
      jsonWebToken = (cookies as { token: string }).token;
    }

    // Fallback to header
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const headerParts = authHeader.split(" ");
      if (headerParts.length !== 2) {
        return [undefined, "invalid-header"];
      }
      const authType = headerParts[0];
      jsonWebToken = headerParts[1];

      if (authType !== "Bearer") {
        return [undefined, "not-bearer"];
      }
    }

    return [jsonWebToken, null];
  } catch (error) {
    return [undefined, "unknown"];
  }
}

/**
 * Checks the token from a request and returns an message about it's status
 *
 * @param req The request to check the token from
 * @return A message about the status of the token
 */
export function checkTokenFromRequest(
  req: Request
): [
  code: undefined | "invalid_request" | "invalid_token" | "no_auth",
  description: undefined | string,
] {
  const [token, error] = tokenFromRequest(req);
  if (error) {
    let description: string | undefined = undefined;
    switch (error) {
      case "invalid-header": {
        description = "Invalid Authorization header";
        break;
      }
      case "not-bearer": {
        description = "Authorization header must be a Bearer token";
        break;
      }
      default: {
        break;
      }
    }
    return ["invalid_request", description];
  }

  if (!token) {
    return ["no_auth", undefined];
  }

  try {
    parseUserJwt(token);
  } catch (jwtParseError) {
    if (jwtParseError instanceof jsonwebtoken.TokenExpiredError) {
      return ["invalid_token", "Token expired"];
    }
    if (jwtParseError instanceof jsonwebtoken.NotBeforeError) {
      return ["invalid_token", "Token not yet valid"];
    }
    if (jwtParseError instanceof jsonwebtoken.JsonWebTokenError) {
      return ["invalid_token", "Invalid token"];
    }
    return ["invalid_token", "Invalid token"];
  }

  return [undefined, undefined];
}

/**
 * @deprecated Use the export from @ukdanceblue/common instead
 */
export { defaultAuthorization } from "@ukdanceblue/common";
