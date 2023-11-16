import { Authorized } from "type-graphql";

import type { AccessLevel, Authorization, DbRole } from "../../../index.js";
import { CommitteeRole } from "../../../index.js";

export interface AuthorizationRule extends Partial<Authorization> {
  /**
   * Exact DanceBlue role, cannot be used with minDbRole
   */
  dbRole?: DbRole;
  /**
   * The rules for this are as follows:
   * Committee > TeamCaptain > TeamMember > Public > None
   */
  minDbRole?: DbRole;
  /**
   * Exact committee role, cannot be used with minCommitteeRole
   */
  committeeRole?: CommitteeRole;
  /**
   * Minimum committee role, cannot be used with committeeRole
   */
  minCommitteeRole?: CommitteeRole;
  /**
   * The committee's identifier, currently these are not normalized in an enum or the database
   * so just go off what's used elsewhere in the codebase
   *
   * Cannot be used with committeeIdentifiers
   */
  committeeIdentifier?: string;
  /**
   * Same as committeeIdentifier, but allows any of the listed identifiers
   *
   * Cannot be used with committeeIdentifier
   */
  committeeIdentifiers?: readonly string[];
  /**
   * Custom authorization rule
   *
   * Should usually be avoided, but can be used for more complex authorization rules
   */
  custom?: (authorization: Authorization) => boolean;
}

export function checkAuthorization(
  role: AuthorizationRule,
  authorization: Authorization
) {
  if (role.minDbRole != null && role.dbRole != null) {
    throw new TypeError(`Cannot specify both dbRole and minDbRole.`);
  }
  if (role.minCommitteeRole != null && role.committeeRole != null) {
    throw new TypeError(
      `Cannot specify both committeeRole and minCommitteeRole.`
    );
  }
  if (role.committeeIdentifier != null && role.committeeIdentifiers != null) {
    throw new TypeError(
      `Cannot specify both committeeIdentifier and committeeIdentifiers.`
    );
  }

  let matches = true;

  // DB role
  if (role.dbRole != null) {
    matches &&= authorization.dbRole === role.dbRole;
  }

  // Committee role
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
  if (role.committeeIdentifier != null) {
    matches &&= authorization.committeeIdentifier === role.committeeIdentifier;
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
  return matches;
}

export type AuthorizationRuleOrAccessLevel = AuthorizationRule | AccessLevel;

export const AccessLevelAuthorized = Authorized as (
  roles: AccessLevel
) => MethodDecorator & PropertyDecorator;

export const AuthorizationAuthorized = Authorized as (
  roles: readonly AuthorizationRule[]
) => MethodDecorator & PropertyDecorator;
