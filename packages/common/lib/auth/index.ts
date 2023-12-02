import { registerEnumType } from "type-graphql";

export const AuthSource = {
  UkyLinkblue: "UkyLinkblue",
  Anonymous: "Anonymous",
  /**
   * This is a special auth source that is used to indicate that the user
   * does not have any login credentials or that there is no user associated
   * with the authorization state
   * Generally this should never actually be on a user's JWT or in the database
   * and is instead used as a default value in the application
   */
  None: "None",
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

export function stringifyAccessLevel(val: unknown): string {
  let accessLevel: AccessLevel | undefined = undefined;
  if (typeof val === "number") {
    const accessLevels = Object.values(AccessLevel);
    for (const value of accessLevels) {
      if (value === val) {
        accessLevel = value;
        break;
      }
    }
  } else if (typeof val === "string") {
    const accessLevelKeys = Object.keys(
      AccessLevel
    ) as (keyof typeof AccessLevel)[];
    for (const key of accessLevelKeys) {
      if (key === val) {
        accessLevel = AccessLevel[key];
        break;
      }
    }
  } else {
    return "Unknown";
  }

  if (accessLevel == null) {
    return "Unknown";
  }

  switch (accessLevel) {
    case AccessLevel.None: {
      return "None";
    }
    case AccessLevel.Public: {
      return "Public";
    }
    case AccessLevel.TeamMember: {
      return "Team Member";
    }
    case AccessLevel.TeamCaptain: {
      return "Team Captain";
    }
    case AccessLevel.Committee: {
      return "Committee Member";
    }
    case AccessLevel.CommitteeChairOrCoordinator: {
      return "Committee Chair/Coordinator";
    }
    case AccessLevel.Admin: {
      return "Admin";
    }
  }
}

/**
 * DbRole is a shorthand for someone's general role within DanceBlue
 *
 * Someone with a DbRole of "None" has no account, and is just a random person
 * Public however means anyone with LinkBlue or other authentication
 * Team member and captain refer to someone's place on a spirit team
 * Committee means someone is a member of the DanceBlue Committee
 */
export const DbRole = {
  None: "None",
  Public: "Public",
  TeamMember: "TeamMember",
  TeamCaptain: "TeamCaptain",
  Committee: "Committee",
} as const;
export type DbRole = (typeof DbRole)[keyof typeof DbRole];

export function isDbRole(val: unknown): val is DbRole {
  if (typeof val !== "string") {
    return false;
  }
  return Object.values(DbRole).includes(val as DbRole);
}

export function stringifyDbRole(val: unknown): string {
  let dbRole: DbRole | undefined = undefined;
  if (typeof val === "string") {
    const dbRoleKeys = Object.keys(DbRole) as (keyof typeof DbRole)[];
    for (const key of dbRoleKeys) {
      if (key === val) {
        dbRole = DbRole[key];
        break;
      }
    }
  } else {
    return "Unknown";
  }

  if (dbRole == null) {
    return "Unknown";
  }

  switch (dbRole) {
    case DbRole.None: {
      return "None";
    }
    case DbRole.Public: {
      return "Public";
    }
    case DbRole.TeamMember: {
      return "Team Member";
    }
    case DbRole.TeamCaptain: {
      return "Team Captain";
    }
    case DbRole.Committee: {
      return "Committee Member";
    }
  }
}

export const CommitteeRole = {
  Chair: "Chair",
  Coordinator: "Coordinator",
  Member: "Member",
} as const;
export type CommitteeRole = (typeof CommitteeRole)[keyof typeof CommitteeRole];

export function isCommitteeRole(val: unknown): val is CommitteeRole {
  if (typeof val !== "string") {
    return false;
  }
  return Object.values(CommitteeRole).includes(val as CommitteeRole);
}

export const CommitteeIdentifier = {
  programmingCommittee: "programmingCommittee",
  fundraisingCommittee: "fundraisingCommittee",
  communityDevelopmentCommittee: "communityDevelopmentCommittee",
  dancerRelationsCommittee: "dancerRelationsCommittee",
  familyRelationsCommittee: "familyRelationsCommittee",
  techCommittee: "techCommittee",
  operationsCommittee: "operationsCommittee",
  marketingCommittee: "marketingCommittee",
  corporateCommittee: "corporateCommittee",
  miniMarathonsCommittee: "miniMarathonsCommittee",
} as const;
export type CommitteeIdentifier =
  (typeof CommitteeIdentifier)[keyof typeof CommitteeIdentifier];

export function isCommitteeIdentifier(
  val: unknown
): val is CommitteeIdentifier {
  if (typeof val !== "string") {
    return false;
  }
  return Object.values(CommitteeIdentifier).includes(
    val as CommitteeIdentifier
  );
}

export const committeeNames: Record<CommitteeIdentifier, string> = {
  programmingCommittee: "Programming Committee",
  fundraisingCommittee: "Fundraising Committee",
  communityDevelopmentCommittee: "Community Development Committee",
  dancerRelationsCommittee: "Dancer Relations Committee",
  familyRelationsCommittee: "Family Relations Committee",
  techCommittee: "Tech Committee",
  operationsCommittee: "Operations Committee",
  marketingCommittee: "Marketing Committee",
  corporateCommittee: "Corporate Committee",
  miniMarathonsCommittee: "Mini Marathons Committee",
};

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
  authSource: AuthSource;
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

registerEnumType(CommitteeIdentifier, {
  name: "CommitteeIdentifier",
  description: "The identifier for a committee",
});
