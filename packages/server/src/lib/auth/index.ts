import type { JwtPayload, UserData } from "@ukdanceblue/common";
import { AuthSource } from "@ukdanceblue/common";
import jsonwebtoken from "jsonwebtoken";
import type { Request } from "koa";

import { jwtSecret } from "#environment";

const jwtIssuer = "https://app.danceblue.org";

/**
 * @param payload The payload to check
 * @return Whether the payload is a valid JWT payload
 */
export function isValidJwtPayload(payload: unknown): payload is JwtPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }
  const { sub, auth_source } = payload as Record<keyof JwtPayload, unknown>;
  if (sub !== undefined && typeof sub !== "string") {
    return false;
  }
  if (
    ![...Object.values(AuthSource), "UkyLinkblue"].includes(
      auth_source as AuthSource
    )
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
    auth_source:
      // Handle legacy "UkyLinkblue" auth source, can remove eventually
      (user.authSource as string) === "UkyLinkblue"
        ? AuthSource.LinkBlue
        : user.authSource,
  };

  if (user.userId) {
    payload.sub = user.userId;
  }

  return jsonwebtoken.sign(payload, jwtSecret, {
    issuer: jwtIssuer,
    // TODO: Set expiration
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

  const userData: UserData = {
    authSource: payload.auth_source,
  };

  if (payload.sub) {
    userData.userId = payload.sub;
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
    const cookies = req.ctx.cookies as unknown;
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
