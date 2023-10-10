import { registerEnumType } from "type-graphql";

export const AuthSource = {
  UkyLinkblue: "UkyLinkblue",
  Anonymous: "Anonymous",
} as const;
export type AuthSource = (typeof AuthSource)[keyof typeof AuthSource];

export const AccessLevel = {
  None: -1,
  Public: 0,
  TeamMember: 1,
  TeamCaptain: 2,
  Committee: 3,
  CommitteeChairOrCoordinator: 3.5,
  Admin: 4, // Tech committee
} as const;
export type AccessLevel = (typeof AccessLevel)[keyof typeof AccessLevel];

export const DbRole = {
  None: "None",
  Public: "Public",
  TeamMember: "TeamMember",
  TeamCaptain: "TeamCaptain",
  Committee: "Committee",
} as const;
export type DbRole = (typeof DbRole)[keyof typeof DbRole];

export const CommitteeRole = {
  Chair: "Chair",
  Coordinator: "Coordinator",
  Member: "Member",
} as const;
export type CommitteeRole = (typeof CommitteeRole)[keyof typeof CommitteeRole];

export interface Authorization {
  dbRole: DbRole;
  committeeRole?: CommitteeRole;
  committee?: string;
  accessLevel: AccessLevel;
}

export interface UserData {
  auth: Authorization;
  userId?: string;
  teamIds?: string[];
  captainOfTeamIds?: string[];
}

export interface JwtPayload {
  sub: string;
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

// Registering the enum types with TypeGraphQL
registerEnumType(AuthSource, {
  name: "AuthSource",
  description: "The source of authentication",
});

registerEnumType(AccessLevel, {
  name: "AccessLevel",
  description: "The level of access a user has",
});

registerEnumType(DbRole, {
  name: "DbRole",
  description: "DanceBlue roles",
});

registerEnumType(CommitteeRole, {
  name: "CommitteeRole",
  description: "Roles within a committee",
});
