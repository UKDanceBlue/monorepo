import type { ArgsDictionary, MiddlewareFn } from "type-graphql";
import { UseMiddleware } from "type-graphql";
import type { Primitive } from "utility-types";

import type {
  AccessLevel,
  Authorization,
  CommitteeRole,
  DbRole,
  PersonNode,
  UserData,
} from "../index.js";
import {
  DetailedError,
  ErrorCode,
  compareCommitteeRole,
  compareDbRole,
} from "../index.js";

export interface AuthorizationRule {
  /**
   * The minimum access level required to access this resource
   */
  accessLevel?: AccessLevel;
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
  {
    accessLevel,
    committeeIdentifier,
    committeeIdentifiers,
    committeeRole,
    custom,
    dbRole,
    minCommitteeRole,
    minDbRole,
  }: AuthorizationRule,
  authorization: Authorization
) {
  if (minDbRole != null && dbRole != null) {
    throw new TypeError(`Cannot specify both dbRole and minDbRole.`);
  }
  if (minCommitteeRole != null && committeeRole != null) {
    throw new TypeError(
      `Cannot specify both committeeRole and minCommitteeRole.`
    );
  }
  if (committeeIdentifier != null && committeeIdentifiers != null) {
    throw new TypeError(
      `Cannot specify both committeeIdentifier and committeeIdentifiers.`
    );
  }

  let matches = true;

  // Access Level
  if (accessLevel != null) {
    matches &&= authorization.accessLevel >= accessLevel;
  }

  // DB role
  if (dbRole != null) {
    matches &&= authorization.dbRole === dbRole;
  }
  if (minDbRole != null) {
    matches &&= compareDbRole(authorization.dbRole, minDbRole) >= 0;
  }

  // Committee role
  if (committeeRole != null) {
    matches &&= authorization.committees.some(
      (committee) =>
        committee.role === committeeRole &&
        committee.identifier === committeeIdentifier
    );
  }
  if (minCommitteeRole != null) {
    if (authorization.committees.length === 0) {
      matches = false;
    } else {
      matches &&= authorization.committees.some(
        (committee) =>
          compareCommitteeRole(committee.role, minCommitteeRole) >= 0
      );
    }
  }

  // Committee identifier(s)
  if (committeeIdentifier != null) {
    matches &&= authorization.committees.some(
      (committee) => committee.identifier === committeeIdentifier
    );
  }
  if (committeeIdentifiers != null) {
    matches &&= authorization.committees.some((committee) =>
      committeeIdentifiers.includes(committee.identifier)
    );
  }

  // Custom auth checker
  if (custom != null) {
    matches &&= custom(authorization);
  }
  return matches;
}

/**
 * An AccessControlParam accepts a user if:
 *
 * 1. The user's access level is greater than or equal to the access level specified (AccessLevel.None by default)
 * 2. The user's role matches one of the specified authorization rules
 * 3. The resolver arguments match ALL of the specified argument matchers
 */
export interface AccessControlParam<
  RootType extends Record<string, unknown> = Record<string, unknown>,
> {
  authRules?: readonly AuthorizationRule[];
  accessLevel?: AccessLevel;
  argumentMatch?: {
    argument: string | ((args: ArgsDictionary) => Primitive | Primitive[]);
    extractor: (
      userData: UserData,
      person: PersonNode | null
    ) => Primitive | Primitive[];
  }[];
  rootMatch?: {
    root: string | ((root: RootType) => Primitive | Primitive[]);
    extractor: (
      userData: UserData,
      person: PersonNode | null
    ) => Primitive | Primitive[];
  }[];
}

export interface AuthorizationContext {
  authenticatedUser: PersonNode | null;
  userData: UserData;
}

export function AccessControl<
  RootType extends Record<string, unknown> = Record<string, unknown>,
>(
  ...params: AccessControlParam<RootType>[]
): MethodDecorator & PropertyDecorator {
  const middleware: MiddlewareFn<AuthorizationContext> = (
    resolverData,
    next
  ) => {
    const { context, args } = resolverData;
    const root = resolverData.root as RootType;
    const { userData, authenticatedUser } = context;

    let ok = false;

    for (const rule of params) {
      if (rule.accessLevel != null) {
        if (rule.accessLevel > userData.auth.accessLevel) {
          continue;
        }
      }

      if (rule.authRules != null) {
        if (rule.authRules.length === 0) {
          throw new DetailedError(
            ErrorCode.InternalFailure,
            "Resource has no allowed authorization rules."
          );
        }
        const matches = rule.authRules.some((rule) =>
          checkAuthorization(rule, userData.auth)
        );
        if (!matches) {
          continue;
        }
      }

      if (rule.argumentMatch != null) {
        for (const match of rule.argumentMatch) {
          const argValue =
            typeof match.argument === "string"
              ? (args[match.argument] as Primitive | Primitive[])
              : match.argument(args);
          if (argValue == null) {
            throw new DetailedError(
              ErrorCode.InternalFailure,
              "FieldMatchAuthorized argument is null or undefined."
            );
          }
          const expectedValue = match.extractor(userData, authenticatedUser);

          if (Array.isArray(expectedValue)) {
            if (Array.isArray(argValue)) {
              if (argValue.some((v) => expectedValue.includes(v))) {
                continue;
              }
            } else if (expectedValue.includes(argValue)) {
              continue;
            }
          } else if (argValue !== expectedValue) {
            if (Array.isArray(argValue)) {
              if (argValue.includes(expectedValue)) {
                continue;
              }
            }
          }
        }
      }

      if (rule.rootMatch != null) {
        for (const match of rule.rootMatch) {
          const rootValue =
            typeof match.root === "string"
              ? (root as Record<string, Primitive | Primitive[]>)[match.root]
              : match.root(root);
          if (rootValue == null) {
            throw new DetailedError(
              ErrorCode.InternalFailure,
              "FieldMatchAuthorized root is null or undefined."
            );
          }
          const expectedValue = match.extractor(userData, authenticatedUser);

          if (Array.isArray(expectedValue)) {
            if (Array.isArray(rootValue)) {
              if (!rootValue.some((v) => expectedValue.includes(v))) {
                continue;
              }
            } else if (!expectedValue.includes(rootValue)) {
              continue;
            }
          } else if (Array.isArray(rootValue)) {
            if (!rootValue.includes(expectedValue)) {
              continue;
            }
          } else if (rootValue !== expectedValue) {
            continue;
          }
        }
      }

      ok = true;
      break;
    }

    if (!ok) {
      throw new DetailedError(
        ErrorCode.Unauthorized,
        "You are not authorized to access this resource."
      );
    } else {
      return next();
    }
  };

  return UseMiddleware(middleware);
}
