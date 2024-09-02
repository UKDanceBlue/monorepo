import {
  AccessLevel,
  compareCommitteeRole,
  compareDbRole,
  parseGlobalId,
} from "../index.js";

import { UseMiddleware } from "type-graphql";

import type {
  Authorization,
  CommitteeRole,
  DbRole,
  GlobalId,
  MembershipPositionType,
  PersonNode,
  TeamType,
  UserData,
} from "../index.js";
import type { ArgsDictionary, MiddlewareFn } from "type-graphql";
import type { Primitive } from "utility-types";
import { Err, None, Option, Result, Some } from "ts-results-es";
import { AccessControlError } from "../error/control.js";
import { InvariantError } from "../error/direct.js";
import { GraphQLNonNull } from "graphql";
import { ConcreteResult } from "../error/result.js";

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
  }

  // DB role
  if (dbRole != null) {
    matches &&= authorization.dbRole === dbRole;
  }
  if (minDbRole != null) {
    matches &&= compareDbRole(authorization.dbRole, minDbRole) >= 0;
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
    matches &&= await custom(authorization);
  }
  return matches;
}

interface ExtractorData {
  authenticatedUser: PersonNode | null;
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
export interface AccessControlParam<RootType = never, ResultType = never> {
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
   *
   * If the custom rule returns a boolean the user is allowed access if the rule returns true and an error is thrown if the rule returns false.
   * If the custom rule returns null the field is set to null (make sure the field is nullable in the schema)
   * If one param returns false and another returns null, an error will be thrown and the null ignored.
   */
  custom?: (
    root: RootType,
    context: ExtractorData,
    result: Option<ResultType>
  ) => boolean | null | Promise<boolean | null>;
}

export interface SimpleTeamMembership {
  teamType: TeamType;
  teamId: string;
  position: MembershipPositionType;
}

export interface AuthorizationContext {
  authenticatedUser: PersonNode | null;
  teamMemberships: SimpleTeamMembership[];
  userData: UserData;
  authorization: Authorization;
}

export function AccessControl<
  RootType extends object = never,
  ResultType extends object = never,
>(
  ...params: AccessControlParam<RootType, ResultType>[]
): MethodDecorator & PropertyDecorator {
  const middleware: MiddlewareFn<AuthorizationContext> = async (
    resolverData,
    next
  ) => {
    const { context, args, info } = resolverData;
    const root = resolverData.root as RootType;
    const { authorization } = context;

    if (authorization.accessLevel === AccessLevel.SuperAdmin) {
      // Super admins have access to everything
      return next();
    }

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
          return Err(
            new InvariantError("Resource has no allowed authorization rules.")
          );
        }
        let matches = false;
        for (const authRule of authRules) {
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
          let argValue: Primitive | Primitive[];
          if (match.argument === "id") {
            argValue = parseGlobalId(args.id)
              .map(({ id }) => args[id])
              .unwrapOr(null);
          } else if (typeof match.argument === "string") {
            argValue = args[match.argument];
          } else {
            argValue = match.argument(args);
          }
          if (argValue == null) {
            return Err(
              new InvariantError(
                "FieldMatchAuthorized argument is null or undefined."
              )
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
          let rootValue: Primitive | Primitive[];
          if (match.root === "id") {
            rootValue = (root as { id: GlobalId }).id.id;
          } else if (typeof match.root === "string") {
            rootValue = (root as Record<string, Primitive | Primitive[]>)[
              match.root
            ];
          } else {
            rootValue = match.root(root);
          }
          if (rootValue == null) {
            return Err(
              new InvariantError(
                "FieldMatchAuthorized root is null or undefined."
              )
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

      ok = true;
      break;
    }

    if (!ok) {
      if (info.returnType instanceof GraphQLNonNull) {
        return Err(new AccessControlError(info));
      } else {
        return null;
      }
    }

    const result = (await next()) as
      | ResultType
      | Option<ResultType>
      | ConcreteResult<ResultType>
      | ConcreteResult<Option<ResultType>>;
    let resultValue: Option<ResultType>;
    if (Result.isResult(result)) {
      if (result.isErr()) {
        resultValue = None;
      } else {
        resultValue = Option.isOption(result.value)
          ? result.value
          : Some(result.value);
      }
    } else {
      resultValue = Option.isOption(result) ? result : Some(result);
    }

    let customResult: boolean | null = true;
    for (const rule of params) {
      if (rule.custom != null) {
        customResult = await rule.custom(root, context, resultValue);
        if (customResult === true) {
          break;
        }
      }
    }

    if (customResult === false) {
      return Err(new AccessControlError(info));
    } else if (customResult === null) {
      return null;
    }

    return result;
  };

  return UseMiddleware(middleware);
}
