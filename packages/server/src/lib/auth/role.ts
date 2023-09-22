import type { Authorization, RoleResource } from "@ukdanceblue/common";
import { AccessLevel, CommitteeRole, DbRole } from "@ukdanceblue/common";

import { logError } from "../../logger.js";

/**
 * Converts a DbRole to an AccessLevel
 *
 * @param role The RoleResource to convert
 * @return The equivalent AccessLevel
 * @throws Error if the DbRole is not a valid member of the DbRole enum
 */
export function roleToAccessLevel(role: RoleResource): AccessLevel {
  switch (role.dbRole) {
    case DbRole.None: {
      return AccessLevel.None;
    }
    case DbRole.Public: {
      return AccessLevel.Public;
    }
    case DbRole.TeamMember: {
      return AccessLevel.TeamMember;
    }
    case DbRole.TeamCaptain: {
      return AccessLevel.TeamCaptain;
    }
    case DbRole.Committee: {
      if (
        role.committeeRole === CommitteeRole.Coordinator ||
        role.committeeRole === CommitteeRole.Chair
      ) {
        return AccessLevel.CommitteeChairOrCoordinator;
      } else {
        return AccessLevel.Committee;
      }
    }
    default: {
      try {
        throw new Error(`Illegal DbRole: ${JSON.stringify(role.dbRole)}`);
      } catch (error) {
        logError(error);
        throw new Error(
          `Illegal DbRole: [Parsing of '${String(role.dbRole)}' failed]`
        );
      }
    }
  }
}

/**
 * Convert a RoleResource to an Authorization object
 *
 * @param role A full RoleResource object
 * @return An Authorization object representing the same role
 * @throws Error if one of committee or committeeRole is set without the other
 */
export function roleToAuthorization(role: RoleResource): Authorization {
  let accessLevel: AccessLevel = AccessLevel.None;
  switch (role.dbRole) {
    case DbRole.Committee: {
      accessLevel = AccessLevel.Committee;
      break;
    }
    case DbRole.TeamCaptain: {
      accessLevel = AccessLevel.TeamCaptain;
      break;
    }
    case DbRole.TeamMember: {
      accessLevel = AccessLevel.TeamMember;
      break;
    }
    case DbRole.Public: {
      accessLevel = AccessLevel.Public;
      break;
    }
    case DbRole.None: {
      accessLevel = AccessLevel.None;
      break;
    }
    default: {
      logError(
        `Illegal DbRole: ${JSON.stringify(
          role.dbRole
        )}, using None. This is a bug.`
      );
      accessLevel = AccessLevel.None;
      break;
    }
  }
  if (
    role.committeeRole === CommitteeRole.Chair ||
    role.committee === "tech-committee"
  ) {
    accessLevel = AccessLevel.Admin;
  }

  const auth: Authorization = {
    dbRole: role.dbRole,
    accessLevel,
  };

  if (role.committeeRole && role.committee) {
    auth.committeeRole = role.committeeRole;
    auth.committee = role.committee;
  } else if (role.committee || role.committeeRole) {
    throw new Error(
      "Cannot have a committee role without a committee or vice versa"
    );
  }

  return auth;
}
