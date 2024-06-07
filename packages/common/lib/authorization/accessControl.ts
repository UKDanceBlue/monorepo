import type { ArgsDictionary, MiddlewareFn } from "type-graphql";
import { UseMiddleware } from "type-graphql";
import type { Primitive } from "utility-types";

import type {
  AccessLevel,
  Authorization,
  CommitteeRole,
  DbRole,
  EffectiveCommitteeRole,
  MembershipPositionType,
  PersonNode,
  TeamType,
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
  // /**
  //  * Exact committee role, cannot be used with minCommitteeRole
  //  */
  // committeeRole?: CommitteeRole;
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
  custom?: (authorization: Authorization) => boolean | Promise<boolean>;
}

export function prettyPrintAuthorizationRule(rule: AuthorizationRule): string {
  const parts: string[] = [];
  if (rule.accessLevel != null) {
    parts.push(`accessLevel >= ${rule.accessLevel}`);
  }
  if (rule.dbRole != null) {
    parts.push(`dbRole === ${rule.dbRole}`);
  }
  if (rule.minDbRole != null) {
    parts.push(`dbRole >= ${rule.minDbRole}`);
  }
  // if (rule.committeeRole != null) {
  //   parts.push(`committeeRole === ${rule.committeeRole}`);
  // }
  if (rule.minCommitteeRole != null) {
    parts.push(`committeeRole >= ${rule.minCommitteeRole}`);
  }
  if (rule.committeeIdentifier != null) {
    parts.push(`committeeIdentifier === ${rule.committeeIdentifier}`);
  }
  if (rule.committeeIdentifiers != null) {
    parts.push(
      `committeeIdentifier in ${rule.committeeIdentifiers.join(", ")}`
    );
  }
  if (rule.custom != null) {
    parts.push(`[custom]`);
  }
  return parts.join(", ");
}

export async function checkAuthorization(
  {
    accessLevel,
    committeeIdentifier,
    committeeIdentifiers,
    // committeeRole,
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
  // if (minCommitteeRole != null && committeeRole != null) {
  //   throw new TypeError(
  //     `Cannot specify both committeeRole and minCommitteeRole.`
  //   );
  // }
  if (committeeIdentifier != null && committeeIdentifiers != null) {
    throw new TypeError(
      `Cannot specify both committeeIdentifier and committeeIdentifiers.`
    );
  }

  let matches = true;

  // Access Level
  if (accessLevel != null) {
    matches &&= authorization.accessLevel >= accessLevel;
    console.log(
      `Access level ${authorization.accessLevel} >= ${accessLevel}: ${matches}`
    );
  }

  // DB role
  if (dbRole != null) {
    matches &&= authorization.dbRole === dbRole;
    console.log(`DB role ${authorization.dbRole} === ${dbRole}: ${matches}`);
  }
  if (minDbRole != null) {
    matches &&= compareDbRole(authorization.dbRole, minDbRole) >= 0;
    console.log(`DB role ${authorization.dbRole} >= ${minDbRole}: ${matches}`);
  }

  // Committee role
  // if (committeeRole != null) {
  //   matches &&= authorization.committees.some(
  //     (committee) =>
  //       committee.role === committeeRole &&
  //       committee.identifier === committeeIdentifier
  //   );
  // }
  if (minCommitteeRole != null) {
    if (authorization.committees.length === 0) {
      matches = false;
      console.log(`No committee roles: ${matches}`);
    } else {
      matches &&= authorization.committees.some(
        (committee) =>
          compareCommitteeRole(committee.role, minCommitteeRole) >= 0
      );
      console.log(
        `Committee role ${authorization.committees
          .map((c) => c.role)
          .join(", ")} >= ${minCommitteeRole}: ${matches}`
      );
    }
  }

  // Committee identifier(s)
  if (committeeIdentifier != null) {
    matches &&= authorization.committees.some(
      (committee) => committee.identifier === committeeIdentifier
    );
    console.log(
      `Committee identifier ${authorization.committees
        .map((c) => c.identifier)
        .join(", ")} === ${committeeIdentifier}: ${matches}`
    );
  }
  if (committeeIdentifiers != null) {
    matches &&= authorization.committees.some((committee) =>
      committeeIdentifiers.includes(committee.identifier)
    );
    console.log(
      `Committee identifier ${authorization.committees
        .map((c) => c.identifier)
        .join(", ")} in ${committeeIdentifiers.join(", ")}: ${matches}`
    );
  }

  // Custom auth checker
  if (custom != null) {
    matches &&= await custom(authorization);
  }
  return matches;
}

interface ExtractorData {
  authenticatedUser: PersonNode | null;
  effectiveCommitteeRoles: EffectiveCommitteeRole[];
  teamMemberships: SimpleTeamMembership[];
  userData: UserData;
  authorization: Authorization;
}

/**
 * An AccessControlParam accepts a user if:
 *
 * 1. The user's access level is greater than or equal to the access level specified (AccessLevel.None by default)
 * 2. The user's role matches one of the specified authorization rules
 * 3. The resolver arguments match ALL of the specified argument matchers
 * 4. The root object matches ALL of the specified root matchers
 * 5. The custom authorization rule returns true
 */
export interface AccessControlParam<RootType extends object = never> {
  authRules?:
    | readonly AuthorizationRule[]
    | ((root: RootType) => readonly AuthorizationRule[]);
  accessLevel?: AccessLevel;
  argumentMatch?: {
    argument: string | ((args: ArgsDictionary) => Primitive | Primitive[]);
    extractor: (param: ExtractorData) => Primitive | Primitive[];
  }[];
  rootMatch?: {
    root: string | ((root: RootType) => Primitive | Primitive[]);
    extractor: (param: ExtractorData) => Primitive | Primitive[];
  }[];
  /**
   * Custom authorization rule
   *
   * Should usually be avoided, but can be used for more complex authorization rules
   */
  custom?: (
    root: RootType,
    authorization: ExtractorData
  ) => boolean | Promise<boolean>;
}

export interface SimpleTeamMembership {
  teamType: TeamType;
  teamId: string;
  position: MembershipPositionType;
}

export interface AuthorizationContext {
  authenticatedUser: PersonNode | null;
  effectiveCommitteeRoles: EffectiveCommitteeRole[];
  teamMemberships: SimpleTeamMembership[];
  userData: UserData;
  authorization: Authorization;
}

export function AccessControl<RootType extends object = never>(
  ...params: AccessControlParam<RootType>[]
): MethodDecorator & PropertyDecorator {
  const middleware: MiddlewareFn<AuthorizationContext> = async (
    resolverData,
    next
  ) => {
    const { context, args } = resolverData;
    const root = resolverData.root as RootType;
    const { authorization } = context;

    let ok = false;

    for (const rule of params) {
      if (rule.accessLevel != null) {
        if (rule.accessLevel > authorization.accessLevel) {
          continue;
        }
      }

      if (rule.authRules != null) {
        const authRules =
          typeof rule.authRules === "function"
            ? rule.authRules(root)
            : rule.authRules;
        if (authRules.length === 0) {
          throw new DetailedError(
            ErrorCode.InternalFailure,
            "Resource has no allowed authorization rules."
          );
        }
        let matches = false;
        for (const authRule of authRules) {
          // eslint-disable-next-line no-await-in-loop
          matches = await checkAuthorization(authRule, authorization);
          if (matches) {
            break;
          }
        }
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
          const expectedValue = match.extractor(context);

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
        let shouldContinue = false;
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
          const expectedValue = match.extractor(context);

          if (Array.isArray(expectedValue)) {
            if (Array.isArray(rootValue)) {
              if (!rootValue.some((v) => expectedValue.includes(v))) {
                shouldContinue = true;
                break;
              }
            } else if (!expectedValue.includes(rootValue)) {
              shouldContinue = true;
              break;
            }
          } else if (Array.isArray(rootValue)) {
            if (!rootValue.includes(expectedValue)) {
              shouldContinue = true;
              break;
            }
          } else if (rootValue !== expectedValue) {
            shouldContinue = true;
            break;
          }
        }
        if (shouldContinue) {
          continue;
        }
      }

      if (rule.custom != null) {
        // eslint-disable-next-line no-await-in-loop
        if (!(await rule.custom(root, context))) {
          continue;
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
