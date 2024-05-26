import type { PersonNode } from "../api/resources/Person.js";
import type { AuthSource } from "../authorization/structures.js";

export interface UserData {
  userId?: string;
  authSource: AuthSource;
}

export function makeUserData(
  person: PersonNode,
  authSource: AuthSource
): UserData {
  return {
    userId: person.id,
    authSource,
  };
}

export interface JwtPayload {
  sub?: string;
  // The type of authentication used to log in (e.g. "uky-linkblue" or "anonymous")
  auth_source: AuthSource;
}
