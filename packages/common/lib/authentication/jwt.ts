import type { PersonResource } from "../api/resources/Person.js";
import { roleToAccessLevel } from "../authorization/role.js";
import type {
  AccessLevel,
  AuthSource,
  Authorization,
  CommitteeRole,
  DbRole,
} from "../authorization/structures.js";

export interface UserData {
  auth: Authorization;
  userId?: string;
  teamIds?: string[];
  captainOfTeamIds?: string[];
  authSource: AuthSource;
}

export function makeUserData(
  person: PersonResource,
  authSource: AuthSource,
  teamIds?: string[],
  captainOfTeamIds?: string[]
): UserData {
  return {
    auth: {
      dbRole: person.role.dbRole,
      committeeRole: person.role.committeeRole ?? undefined,
      committeeIdentifier: person.role.committeeIdentifier ?? undefined,
      accessLevel: roleToAccessLevel(person.role),
    },
    userId: person.uuid,
    teamIds,
    captainOfTeamIds,
    authSource,
  };
}

export interface JwtPayload {
  sub?: string;
  // The type of authentication used to log in (e.g. "uky-linkblue" or "anonymous")
  auth_source: AuthSource;
  // TODO: Replace these fields with either "roles" or "groups" (these are specified in the RFC 7643 Section 4.1.2)
  dbRole: DbRole;
  committee_role?: CommitteeRole;
  committee?: string;
  access_level: AccessLevel;
  team_ids?: string[];
  captain_of_team_ids?: string[];
}
