import { registerEnumType } from "type-graphql";

import type { EffectiveCommitteeRole } from "../api/types/EffectiveCommitteeRole.js";

export const AuthSource = {
  LinkBlue: "LinkBlue",
  Anonymous: "Anonymous",
  Password: "Password",
  /**
   * This is a special auth source that is used to indicate that the user
   * is a demo user (i.e. Apple app review team)
   *
   * This is used to allow the app to be reviewed without having to
   * create a special account for the review team
   */
  Demo: "Demo",
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
export const AuthSourceValues: AuthSource[] = Object.values(
  AuthSource
) as AuthSource[];

export const AccessLevel = {
  None: -1,
  Public: 0,
  UKY: 1,
  Committee: 3,
  CommitteeChairOrCoordinator: 3.5,
  // Anyone on tech committee
  Admin: 4,
  // Tech chair - master override access, allowed to masquerade as any user
  SuperAdmin: 5,
} as const;
export type AccessLevel = (typeof AccessLevel)[keyof typeof AccessLevel];
export const AccessLevelValues: [keyof typeof AccessLevel, AccessLevel][] =
  Object.entries(AccessLevel) as [keyof typeof AccessLevel, AccessLevel][];

export function stringifyAccessLevel(val: unknown): string {
  let accessLevel: AccessLevel | undefined = undefined;
  if (typeof val === "number") {
    const accessLevels = Object.values(AccessLevel) as AccessLevel[];
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
    case AccessLevel.UKY: {
      return "UK Staff/Student";
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
    case AccessLevel.SuperAdmin: {
      return "Super Administrator";
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
  UKY: "UKY",
  Committee: "Committee",
} as const;
export type DbRole = (typeof DbRole)[keyof typeof DbRole];
export const DbRoleValues: DbRole[] = Object.values(DbRole) as DbRole[];

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
    case DbRole.UKY: {
      return "UK Staff/Student";
    }
    case DbRole.Committee: {
      return "Committee Member";
    }
  }
}

export function compareDbRole(a: DbRole, b: DbRole): number {
  if (a === b) {
    return 0;
  }

  switch (a) {
    case DbRole.None: {
      return -1;
    }
    case DbRole.Public: {
      if (b === DbRole.None) {
        return 1;
      }
      return -1;
    }
    case DbRole.UKY: {
      if (b === DbRole.None || b === DbRole.Public) {
        return 1;
      }
      return -1;
    }
    case DbRole.Committee: {
      if (b === DbRole.None || b === DbRole.Public || b === DbRole.UKY) {
        return 1;
      }
      return -1;
    }
    default: {
      a satisfies never;
      throw new Error(`Unknown DbRole: ${String(a)}`);
    }
  }
}

export const CommitteeRole = {
  Chair: "Chair",
  Coordinator: "Coordinator",
  Member: "Member",
} as const;
export type CommitteeRole = (typeof CommitteeRole)[keyof typeof CommitteeRole];
export const CommitteeRoleValues: CommitteeRole[] = Object.values(
  CommitteeRole
) as CommitteeRole[];

export function isCommitteeRole(val: unknown): val is CommitteeRole {
  if (typeof val !== "string") {
    return false;
  }
  return Object.values(CommitteeRole).includes(val as CommitteeRole);
}

export function compareCommitteeRole(
  a: CommitteeRole,
  b: CommitteeRole
): number {
  if (a === b) {
    return 0;
  }

  switch (a) {
    case CommitteeRole.Member: {
      return -1;
    }
    case CommitteeRole.Coordinator: {
      if (b === CommitteeRole.Member) {
        return 1;
      }
      return -1;
    }
    case CommitteeRole.Chair: {
      if (b === CommitteeRole.Member || b === CommitteeRole.Coordinator) {
        return 1;
      }
      return -1;
    }
    default: {
      a satisfies never;
      throw new Error(`Unknown CommitteeRole: ${String(a)}`);
    }
  }
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
  viceCommittee: "viceCommittee",
  overallCommittee: "overallCommittee",
} as const;
export type CommitteeIdentifier =
  (typeof CommitteeIdentifier)[keyof typeof CommitteeIdentifier];
export const CommitteeIdentifierValues: CommitteeIdentifier[] = Object.values(
  CommitteeIdentifier
) as CommitteeIdentifier[];

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
  viceCommittee: "Vice Committee",
  overallCommittee: "Overall Committee",
};

export interface Authorization {
  /** @deprecated */
  dbRole?: DbRole;
  effectiveCommitteeRoles: EffectiveCommitteeRole[];
  accessLevel: AccessLevel;
  authSource: AuthSource;
}

/**
 * The default authorization object, this is always the assumed value
 * if no valid authorization object is provided, and is also the one
 * used for anonymous connections
 */
export const defaultAuthorization = {
  dbRole: DbRole.None,
  accessLevel: AccessLevel.None,
  effectiveCommitteeRoles: [],
  authSource: AuthSource.None,
} satisfies Authorization;

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
