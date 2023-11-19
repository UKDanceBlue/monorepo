import type { AuthorizationRuleOrAccessLevel } from "@ukdanceblue/common";
import { checkAuthorization } from "@ukdanceblue/common";
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
 *   {committeeIdentifier: "fundraisingCommittee", committeeRole: CommitteeRole.Coordinator},
 *   {committeeIdentifier: "dancerRelationsCommittee", committeeRole: CommitteeRole.Coordinator}
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
      if (role.dbRole != null && role.minDbRole != null) {
        throw new TypeError(
          `Cannot specify both dbRole and minDbRole. See ${info.parentType.name}.${info.fieldName}`
        );
      }
      if (role.committeeRole != null && role.minCommitteeRole != null) {
        throw new TypeError(
          `Cannot specify both committeeRole and minCommitteeRole. See ${info.parentType.name}.${info.fieldName}`
        );
      }
      if (
        role.committeeIdentifier != null &&
        role.committeeIdentifiers != null
      ) {
        throw new TypeError(
          `Cannot specify both committeeIdentifier and committeeIdentifiers. See ${info.parentType.name}.${info.fieldName}`
        );
      }

      return checkAuthorization(role, authorization);
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
