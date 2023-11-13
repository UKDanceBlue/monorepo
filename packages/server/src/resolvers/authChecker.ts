import type { AuthorizationRuleOrAccessLevel } from "@ukdanceblue/common";
import { CommitteeRole } from "@ukdanceblue/common";
import type { AuthChecker } from "type-graphql";

import { authorizationOverride } from "../environment.js";
import { logDebug } from "../logger.js";

import type { GraphQLContext } from "./context.js";

/**
 * Custom auth checker for TypeGraphQL
 *
 * Checks that either the context's access level is at least the required level,
 * or that the user's authorization matches one of the listed roles.
 *
 * ```ts
 * // Accepts any user with at least the "Committee" access level
 * @Authorized(AccessLevel.Committee)
 * ```
 *
 * ```ts
 * // Accepts any coordinator on fundraising or dancer relations
 * @Authorized([
 *   {committeeIdentifier: "fundraising-committee", committeeRole: CommitteeRole.Coordinator},
 *   {committeeIdentifier: "dancer-relations-committee", committeeRole: CommitteeRole.Coordinator}
 * ])
 * ```
 *
 * @param resolverData
 * @param roles
 */
export const customAuthChecker: AuthChecker<
  GraphQLContext,
  AuthorizationRuleOrAccessLevel
> = ({ context: { authorization }, info }, roles) => {
  logDebug("customAuthChecker", { authorization, roles });

  // Auth override
  if (authorizationOverride) {
    logDebug("customAuthChecker Authorization override enabled");
    return true;
  }

  for (const role of roles) {
    if (typeof role === "number") {
      if (authorization.accessLevel >= role) {
        return true;
      }
    } else if (typeof role === "object") {
      let matches = true;

      // DB role
      if (role.dbRole != null) {
        matches &&= authorization.dbRole === role.dbRole;
      }

      // Committee role
      if (role.committeeRole != null && role.minCommitteeRole != null) {
        throw new TypeError(
          `Cannot specify both committeeRole and minCommitteeRole. See ${info.parentType.name}.${info.fieldName}`
        );
      }
      if (role.committeeRole != null) {
        matches &&= authorization.committeeRole === role.committeeRole;
      }
      if (role.minCommitteeRole != null) {
        switch (role.minCommitteeRole) {
          case CommitteeRole.Chair: {
            matches &&= authorization.committeeRole === CommitteeRole.Chair;
            break;
          }
          case CommitteeRole.Coordinator: {
            matches &&=
              authorization.committeeRole === CommitteeRole.Chair ||
              authorization.committeeRole === CommitteeRole.Coordinator;
            break;
          }
          case CommitteeRole.Member: {
            matches &&=
              authorization.committeeRole === CommitteeRole.Chair ||
              authorization.committeeRole === CommitteeRole.Coordinator ||
              authorization.committeeRole === CommitteeRole.Member;
            break;
          }
        }
      }

      // Committee identifier(s)
      if (
        role.committeeIdentifier != null &&
        role.committeeIdentifiers != null
      ) {
        throw new TypeError(
          `Cannot specify both committeeIdentifier and committeeIdentifiers. See ${info.parentType.name}.${info.fieldName}`
        );
      }
      if (role.committeeIdentifier != null) {
        matches &&=
          authorization.committeeIdentifier === role.committeeIdentifier;
      }
      if (role.committeeIdentifiers != null) {
        matches &&= role.committeeIdentifiers.includes(
          String(authorization.committeeIdentifier)
        );
      }

      // Custom auth checker
      if (role.custom != null) {
        matches &&= role.custom(authorization);
      }

      // Final result
      if (matches) {
        return true;
      }
    } else {
      throw new TypeError(
        `Invalid role: ${JSON.stringify(role as unknown)}. See ${
          info.parentType.name
        }.${info.fieldName}`
      );
    }
  }
  return false;
};
