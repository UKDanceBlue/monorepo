import type { ArgsDictionary } from "type-graphql";
import { createMethodDecorator, createParamDecorator } from "type-graphql";

import type { Authorization, DbRole, PersonResource } from "../../../index.js";
import {
  AccessLevel,
  CommitteeRole,
  DetailedError,
  ErrorCode,
} from "../../../index.js";

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

export interface AuthorizationContext {
  authenticatedUser: PersonResource | null;
  authorization: Authorization;
}

function throwAccessLevel() {
  throw new DetailedError(
    ErrorCode.Unauthorized,
    "Your access level is insufficient to access this resource."
  );
}

export function AccessLevelAuthorized(
  requiredAccessLevel: AccessLevel = AccessLevel.Public
) {
  return createMethodDecorator<AuthorizationContext>(({ context }, next) => {
    if (requiredAccessLevel > context.authorization.accessLevel) {
      throwAccessLevel();
    }
    return next();
  });
}

export function AccessLevelParameterAuthorized(
  requiredAccessLevel: AccessLevel = AccessLevel.Public,
  tryToNullify = false
) {
  return createParamDecorator<AuthorizationContext>(
    ({ context, root, info }) => {
      if (requiredAccessLevel > context.authorization.accessLevel) {
        if (tryToNullify) {
          return null;
        }
        throwAccessLevel();
      }
      return (root as Record<string, unknown>)[info.fieldName];
    }
  );
}

function throwNoAuthRules() {
  throw new DetailedError(
    ErrorCode.InternalFailure,
    "Resource has no allowed authorization rules."
  );
}

function throwUnauthorized() {
  throw new DetailedError(
    ErrorCode.Unauthorized,
    "You are not authorized to access this resource."
  );
}

export function AuthorizationAuthorized(
  rules: readonly AuthorizationRule[] = []
) {
  return createMethodDecorator<AuthorizationContext>(({ context }, next) => {
    if (rules.length === 0) {
      throwNoAuthRules();
    }
    const matches = rules.some((rule) =>
      checkAuthorization(rule, context.authorization)
    );
    if (!matches) {
      throwUnauthorized();
    }
    return next();
  });
}

/**
 * Checks if the named argument is strictly equal to the value returned by the extractor function
 *
 * @param argument The name of the argument to compare against (or an extractor function)
 * @param extractor A function that takes the resource and authorization and returns the value to compare against
 */
export function ArgumentMatchAuthorized(
  argument: string | ((args: ArgsDictionary) => unknown),
  extractor: (
    authorization: Authorization,
    person: PersonResource | null
  ) => unknown
) {
  return createMethodDecorator<AuthorizationContext>(
    ({ context, args }, next) => {
      const argValue =
        typeof argument === "string"
          ? (args[argument] as unknown)
          : argument(args);
      if (argValue == null) {
        throw new DetailedError(
          ErrorCode.InternalFailure,
          "FieldMatchAuthorized argument is null or undefined."
        );
      }
      const expectedValue = extractor(
        context.authorization,
        context.authenticatedUser
      );

      if (argValue !== expectedValue) {
        throw new DetailedError(
          ErrorCode.Unauthorized,
          `You are not authorized to access this resource.`
        );
      }

      return next();
    }
  );
}
