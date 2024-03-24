import type { RoleResource } from "../api/resources/Role.js";

import type { Authorization } from "./structures.js";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
} from "./structures.js";

/**
 * Converts a DbRole to an AccessLevel
 *
 * @param role The RoleResource to convert
 * @return The equivalent AccessLevel
 * @throws Error if the DbRole is not a valid member of the DbRole enum
 */
export function roleToAccessLevel(role: {
  dbRole: DbRole;
  committeeRole?: CommitteeRole | null;
  committeeIdentifier?: CommitteeIdentifier | null;
}): AccessLevel {
  switch (role.dbRole) {
    case DbRole.None: {
      return AccessLevel.None;
    }
    case DbRole.Public: {
      return AccessLevel.Public;
    }
    case DbRole.UKY: {
      return AccessLevel.UKY;
    }
    case DbRole.Committee: {
      if (role.committeeIdentifier === CommitteeIdentifier.techCommittee) {
        return AccessLevel.Admin;
      } else if (
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
  const auth: Authorization = {
    dbRole: role.dbRole,
    accessLevel: roleToAccessLevel(role),
  };

  if (role.committeeRole && role.committeeIdentifier) {
    auth.committeeRole = role.committeeRole;
    auth.committeeIdentifier = role.committeeIdentifier;
  } else if (role.committeeIdentifier || role.committeeRole) {
    throw new Error(
      "Cannot have a committee role without a committee or vice versa"
    );
  }

  return auth;
}
