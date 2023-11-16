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

export const committeeNames: Record<CommitteeIdentifier, string> = {
  "programming-committee": "Programming Committee",
  "fundraising-committee": "Fundraising Committee",
  "community-development-committee": "Community Development Committee",
  "dancer-relations-committee": "Dancer Relations Committee",
  "family-relations-committee": "Family Relations Committee",
  "tech-committee": "Tech Committee",
  "operations-committee": "Operations Committee",
  "marketing-committee": "Marketing Committee",
  "corporate-committee": "Corporate Committee",
  "mini-marathons-committee": "Mini Marathons Committee",
};

export const CommitteeIdentifier = {
  "programming-committee": "programming-committee",
  "fundraising-committee": "fundraising-committee",
  "community-development-committee": "community-development-committee",
  "dancer-relations-committee": "dancer-relations-committee",
  "family-relations-committee": "family-relations-committee",
  "tech-committee": "tech-committee",
  "operations-committee": "operations-committee",
  "marketing-committee": "marketing-committee",
  "corporate-committee": "corporate-committee",
  "mini-marathons-committee": "mini-marathons-committee",
} as const;
export type CommitteeIdentifier =
  (typeof CommitteeIdentifier)[keyof typeof CommitteeIdentifier];

export interface Authorization {
  dbRole: DbRole;
  committeeRole?: CommitteeRole;
  committeeIdentifier?: string;
  accessLevel: AccessLevel;
}

/**
 * The default authorization object, this is always the assumed value
 * if no valid authorization object is provided, and is also the one
 * used for anonymous connections
 */
export const defaultAuthorization = {
  dbRole: DbRole.None,
  accessLevel: AccessLevel.None,
} satisfies Authorization;

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
