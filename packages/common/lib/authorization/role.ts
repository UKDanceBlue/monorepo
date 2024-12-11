import type { EffectiveCommitteeRole } from "../api/types/EffectiveCommitteeRole.js";
import {
  AccessLevel,
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
} from "./structures.js";

/**
 * Converts a DbRole to an AccessLevel
 *
 * @param role The RoleResource to convert
 * @return The equivalent AccessLevel
 * @throws Error if the DbRole is not a valid member of the DbRole enum
 */
export function roleToAccessLevel(
  effectiveCommitteeRoles: EffectiveCommitteeRole[],
  authSource: AuthSource
): AccessLevel {
  if (authSource === AuthSource.None) {
    return AccessLevel.None;
  }
  if (authSource === AuthSource.Anonymous) {
    return AccessLevel.Public;
  }

  if (effectiveCommitteeRoles.length > 0) {
    let maxLevel: AccessLevel | null = null;
    for (const committee of effectiveCommitteeRoles) {
      let thisLevel: AccessLevel;

      if (committee.identifier === CommitteeIdentifier.techCommittee) {
        thisLevel =
          committee.role === CommitteeRole.Chair
            ? AccessLevel.SuperAdmin
            : AccessLevel.Admin;
      } else if (
        committee.role === CommitteeRole.Coordinator ||
        committee.role === CommitteeRole.Chair
      ) {
        thisLevel = AccessLevel.CommitteeChairOrCoordinator;
      } else {
        thisLevel = AccessLevel.Committee;
      }

      if (maxLevel === null || thisLevel > maxLevel) {
        maxLevel = thisLevel;
      }
    }
    if (maxLevel === null) {
      throw new Error("No committee roles found when DbRole was Committee");
    }
    return maxLevel;
  } else {
    authSource satisfies
      | typeof AuthSource.LinkBlue
      | typeof AuthSource.Password
      | typeof AuthSource.Demo;
    return AccessLevel.UKY;
  }
}
