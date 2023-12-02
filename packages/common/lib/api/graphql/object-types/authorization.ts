import type { ArgsDictionary, MiddlewareFn } from "type-graphql";
import { UseMiddleware } from "type-graphql";

import type {
  AccessLevel,
  AuthSource,
  Authorization,
  DbRole,
  PersonResource,
} from "../../../index.js";
import { CommitteeRole, DetailedError, ErrorCode } from "../../../index.js";

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

/**
 * An AccessControlParam accepts a user if:
 *
 * 1. The user's access level is greater than or equal to the access level specified (AccessLevel.None by default)
 * 2. The user's role matches one of the specified authorization rules
 * 3. The resolver arguments match ALL of the specified argument matchers
 */
export interface AccessControlParam {
  authRules?: readonly AuthorizationRule[];
  accessLevel?: AccessLevel;
  argumentMatch?: {
    argument: string | ((args: ArgsDictionary) => unknown);
    extractor: (
      authorization: Authorization,
      person: PersonResource | null
    ) => unknown;
  }[];
}

export interface AuthorizationContext {
  authenticatedUser: PersonResource | null;
  authorization: Authorization;
  authSource: AuthSource;
}

// function throwAccessLevel() {
//   throw new DetailedError(
//     ErrorCode.Unauthorized,
//     "Your access level is insufficient to access this resource."
//   );
// }

// export function AccessLevelAuthorized(
//   requiredAccessLevel: AccessLevel = AccessLevel.Public
// ): MethodDecorator & PropertyDecorator {
//   const middleware: MiddlewareFn<AuthorizationContext> = (
//     { context },
//     next
//   ) => {
//     if (requiredAccessLevel > context.authorization.accessLevel) {
//       throwAccessLevel();
//     }
//     return next();
//   };

//   return UseMiddleware(middleware);
// }

// function throwNoAuthRules() {
//   throw new DetailedError(
//     ErrorCode.InternalFailure,
//     "Resource has no allowed authorization rules."
//   );
// }

// function throwUnauthorized() {
//   throw new DetailedError(
//     ErrorCode.Unauthorized,
//     "You are not authorized to access this resource."
//   );
// }

// export function AuthorizationAuthorized(
//   rules: readonly AuthorizationRule[] = []
// ): MethodDecorator & PropertyDecorator {
//   const middleware: MiddlewareFn<AuthorizationContext> = (
//     { context },
//     next
//   ) => {
//     if (rules.length === 0) {
//       throwNoAuthRules();
//     }
//     const matches = rules.some((rule) =>
//       checkAuthorization(rule, context.authorization)
//     );
//     if (!matches) {
//       throwUnauthorized();
//     }
//     return next();
//   };

//   return UseMiddleware(middleware);
// }

// function throwNullArgument() {
//   throw new DetailedError(
//     ErrorCode.InternalFailure,
//     "FieldMatchAuthorized argument is null or undefined."
//   );
// }

// export function AuthorizationOrAccessLevelAuthorized(
//   rules: readonly (AuthorizationRule | AccessLevel)[] = []
// ): MethodDecorator & PropertyDecorator {
//   const middleware: MiddlewareFn<AuthorizationContext> = (
//     { context },
//     next
//   ) => {
//     if (rules.length === 0) {
//       throwNoAuthRules();
//     }
//     const matches = rules.some((rule) => {
//       return typeof rule === "number"
//         ? rule <= context.authorization.accessLevel
//         : checkAuthorization(rule, context.authorization);
//     });
//     if (!matches) {
//       throwUnauthorized();
//     }
//     return next();
//   };

//   return UseMiddleware(middleware);
// }

// /**
//  * Checks if the named argument is strictly equal to the value returned by the extractor function
//  *
//  * @param argument The name of the argument to compare against (or an extractor function)
//  * @param extractor A function that takes the resource and authorization and returns the value to compare against
//  */
// export function ArgumentMatchAuthorized(
//   argument: string | ((args: ArgsDictionary) => unknown),
//   extractor: (
//     authorization: Authorization,
//     person: PersonResource | null
//   ) => unknown
// ): MethodDecorator & PropertyDecorator {
//   const middleware: MiddlewareFn<AuthorizationContext> = (
//     { context, args },
//     next
//   ) => {
//     const argValue =
//       typeof argument === "string"
//         ? (args[argument] as unknown)
//         : argument(args);
//     if (argValue == null) {
//       throwNullArgument();
//     }
//     const expectedValue = extractor(
//       context.authorization,
//       context.authenticatedUser
//     );

//     if (argValue !== expectedValue) {
//       throwUnauthorized();
//     }

//     return next();
//   };

//   return UseMiddleware(middleware);
// }

export function AccessControl(
  ...params: AccessControlParam[]
): MethodDecorator & PropertyDecorator {
  const middleware: MiddlewareFn<AuthorizationContext> = (
    { context, args },
    next
  ) => {
    const { authorization, authenticatedUser } = context;

    let ok = false;

    for (const rule of params) {
      if (rule.accessLevel != null) {
        if (rule.accessLevel > authorization.accessLevel) {
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
          checkAuthorization(rule, authorization)
        );
        if (!matches) {
          continue;
        }
      }

      if (rule.argumentMatch != null) {
        for (const match of rule.argumentMatch) {
          const argValue =
            typeof match.argument === "string"
              ? (args[match.argument] as unknown)
              : match.argument(args);
          if (argValue == null) {
            throw new DetailedError(
              ErrorCode.InternalFailure,
              "FieldMatchAuthorized argument is null or undefined."
            );
          }
          const expectedValue = match.extractor(
            authorization,
            authenticatedUser
          );

          if (argValue !== expectedValue) {
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
