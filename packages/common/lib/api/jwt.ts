import type { AuthSource } from "../authorization/structures.js";

export interface UserData {
  userId?: string;
  authSource: AuthSource;
}

export interface JwtPayload {
  sub?: string;
  // The type of authentication used to log in (e.g. "uky-linkblue" or "anonymous")
  auth_source: AuthSource;
}
