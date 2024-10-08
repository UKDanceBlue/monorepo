import {
  AccessLevel,
  committeeNames,
  compareCommitteeRole,
  parseGlobalId,
  stringifyAccessLevel,
} from "../index.js";

import { UseMiddleware } from "type-graphql";

import type {
  Authorization,
  CommitteeIdentifier,
  CommitteeRole,
  GlobalId,
  MembershipPositionType,
  PersonNode,
  TeamType,
  UserData,
} from "../index.js";
import type { ArgsDictionary, MiddlewareFn } from "type-graphql";
import type { Primitive } from "utility-types";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";
import { AccessControlError } from "../error/control.js";
import { InvariantError } from "../error/direct.js";
import { GraphQLNonNull } from "graphql";
import { ConcreteResult } from "../error/result.js";

export interface AuthorizationRule {
  /**
   * The minimum access level required to access this resource
   */
  accessLevel?: AccessLevel;
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
  committeeIdentifier?: CommitteeIdentifier;
  /**
   * Same as committeeIdentifier, but allows any of the listed identifiers
   *
   * Cannot be used with committeeIdentifier
   */
  committeeIdentifiers?: readonly CommitteeIdentifier[];
}

export function prettyPrintAuthorizationRule(rule: AuthorizationRule): string {
  const parts: string[] = [];
  if (rule.accessLevel != null) {
    parts.push(
      `have an access level of at least ${stringifyAccessLevel(rule.accessLevel)}`
    );
  }
  if (rule.minCommitteeRole != null) {
    parts.push(`have a committee role of at least ${rule.minCommitteeRole}`);
  }
  if (rule.committeeIdentifier != null) {
    parts.push(`be a member of ${committeeNames[rule.committeeIdentifier!]}`);
  }
  if (rule.committeeIdentifiers != null) {
    parts.push(
      `be a member of one of the following committees: ${rule.committeeIdentifiers
        .map((id) => committeeNames[id])
        .join(", ")}`
    );
  }
  return parts.join(" and ");
}

export function checkAuthorization(
  {
    accessLevel,
    committeeIdentifier,
    committeeIdentifiers,
    // committeeRole,
    minCommitteeRole,
  }: AuthorizationRule,
  authorization: Authorization
) {
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

  if (minCommitteeRole != null) {
    if (authorization.effectiveCommitteeRoles.length === 0) {
      matches = false;
    } else {
      matches &&= authorization.effectiveCommitteeRoles.some(
        (committee) =>
          compareCommitteeRole(committee.role, minCommitteeRole) >= 0
      );
    }
  }

  // Committee identifier(s)
  if (committeeIdentifier != null) {
    matches &&= authorization.effectiveCommitteeRoles.some(
      (committee) => committee.identifier === committeeIdentifier
    );
  }
  if (committeeIdentifiers != null) {
    matches &&= authorization.effectiveCommitteeRoles.some((committee) =>
      committeeIdentifiers.includes(committee.identifier)
    );
  }

  return matches;
}

export interface AccessControlContext {
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
export interface AccessControlParam<RootType = never> {
  authRules?:
    | readonly AuthorizationRule[]
    | ((root: RootType) => readonly AuthorizationRule[]);
  accessLevel?: AccessLevel;
  argumentMatch?: {
    argument: string | ((args: ArgsDictionary) => Primitive | Primitive[]);
    extractor: (param: AccessControlContext) => Primitive | Primitive[];
  }[];
  rootMatch?: {
    root: string | ((root: RootType) => Primitive | Primitive[]);
    extractor: (param: AccessControlContext) => Primitive | Primitive[];
  }[];
}

/**
 * Custom authorization rule
 *
 * Should usually be avoided, but can be used for more complex authorization rules
 *
 * If the custom rule returns a boolean the user is allowed access if the rule returns true and an error is thrown if the rule returns false.
 * If the custom rule returns null the field is set to null (make sure the field is nullable in the schema)
 * If one param returns false and another returns null, an error will be thrown and the null ignored.
 */
export type CustomAuthorizationFunction<RootType, ResultType> = (
  root: RootType,
  context: AccessControlContext,
  result: Option<ResultType>,
  args: { [key: string]: unknown }
) => boolean | null | Promise<boolean | null>;

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

export async function checkParam<RootType extends object = never>(
  rule: AccessControlParam<RootType>,
  authorization: Authorization,
  root: RootType,
  args: ArgsDictionary,
  context: AccessControlContext
): Promise<Result<boolean, InvariantError>> {
  if (rule.accessLevel != null) {
    if (rule.accessLevel > authorization.accessLevel) {
      return Ok(false);
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
      return Ok(false);
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
            return Ok(false);
          }
        } else if (expectedValue.includes(argValue)) {
          return Ok(false);
        }
      } else if (argValue !== expectedValue) {
        if (Array.isArray(argValue)) {
          if (argValue.includes(expectedValue)) {
            return Ok(false);
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
          new InvariantError("FieldMatchAuthorized root is null or undefined.")
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
      return Ok(false);
    }
  }

  return Ok(true);
}

export function AccessControl<
  RootType extends object = never,
  ResultType extends object = never,
>(
  params: CustomAuthorizationFunction<RootType, ResultType>
): MethodDecorator & PropertyDecorator;
export function AccessControl<
  RootType extends object = never,
  ResultType extends object = never,
>(
  ...params: AccessControlParam<RootType>[]
): MethodDecorator & PropertyDecorator;
export function AccessControl<
  RootType extends object = never,
  ResultType extends object = never,
>(
  ...params:
    | AccessControlParam<RootType>[]
    | [CustomAuthorizationFunction<RootType, ResultType>]
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

    if (typeof params[0] === "function") {
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

      let customResult = await params[0](root, context, resultValue, args);

      if (customResult === false) {
        return Err(new AccessControlError(info));
      } else if (customResult === null) {
        return null;
      }

      return result;
    } else {
      for (const rule of params as AccessControlParam<RootType>[]) {
        const result = await checkParam(
          rule,
          authorization,
          root,
          args,
          context
        );
        if (result.isErr()) {
          return Err(result.error);
        }

        ok = result.value;
        if (ok) {
          break;
        }
      }

      if (!ok) {
        if (info.returnType instanceof GraphQLNonNull) {
          return Err(new AccessControlError(info));
        } else {
          return null;
        }
      }

      return next();
    }
  };

  return UseMiddleware(middleware);
}
