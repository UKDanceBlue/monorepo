import { Authorized } from "type-graphql";

import type {
  AccessLevel,
  Authorization,
  CommitteeRole,
  DbRole,
} from "../../../index.js";

export interface AuthorizationRule extends Partial<Authorization> {
  /**
   * Exact DanceBlue community role. This does not have a minDbRole equivalent
   * as there isn't a defined hierarchy for these roles. If you need to check
   * for a minimum role, you will need to have multiple rules.
   */
  dbRole?: DbRole;
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

export type AuthorizationRuleOrAccessLevel = AuthorizationRule | AccessLevel;

export const AccessLevelAuthorized = Authorized as (
  roles: AccessLevel
) => MethodDecorator & PropertyDecorator;

export const AuthorizationAuthorized = Authorized as (
  roles: readonly AuthorizationRule[]
) => MethodDecorator & PropertyDecorator;
