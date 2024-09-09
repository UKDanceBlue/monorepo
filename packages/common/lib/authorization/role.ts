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
export function roleToAccessLevel({
  dbRole,
  committees,
}: {
  dbRole: DbRole;
  committees?: { identifier: CommitteeIdentifier; role: CommitteeRole }[];
}): AccessLevel {
  switch (dbRole) {
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
      let maxLevel: AccessLevel | null = null;
      for (const committee of committees ?? []) {
        let thisLevel: AccessLevel;

        if (committee.identifier === CommitteeIdentifier.techCommittee) {
          if (committee.role === CommitteeRole.Chair) {
            thisLevel = AccessLevel.SuperAdmin;
          } else {
            thisLevel = AccessLevel.Admin;
          }
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
    }
    default: {
      dbRole satisfies never;
      try {
        throw new Error(`Illegal DbRole: ${JSON.stringify(dbRole)}`);
      } catch (error) {
        throw new Error(
          `Illegal DbRole: [Parsing of '${String(dbRole)}' failed]`
        );
      }
    }
  }
}
