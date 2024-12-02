import { Err, None, Option, Result, Some } from "ts-results-es";
import type { MiddlewareFn } from "type-graphql";
import { UseMiddleware } from "type-graphql";

import { AccessControlError } from "../error/control.js";
import type { ConcreteResult } from "../error/result.js";
import type {
  AccessControlContext,
  AuthorizationContext,
} from "./accessControl.js";
import { AccessLevel } from "./structures.js";

/**
 * Custom authorization rule
 *
 * Should usually be avoided, but can be used for more complex authorization
 * rules
 *
 * - If the custom rule returns a boolean the user is allowed access if the rule
 *   returns true and an error is thrown if the rule returns false.
 * - If the custom rule returns null the field is set to null (make sure the
 *   field is nullable in the schema)
 * - If one param returns false and another returns null, an error will be
 *   thrown and the null ignored.
 */
export type CustomQueryAuthorizationFunction<RootType, ResultType> = (
  root: RootType,
  context: AccessControlContext,
  result: Option<ResultType>,
  args: Record<string, unknown>
) => boolean | null | Promise<boolean | null>;

/**
 * Custom mutation authorization function
 *
 * Same as CustomAuthorizationFunction, but without root or result
 *
 * Should usually be avoided, but can be used for more complex authorization
 * rules
 *
 * - If the custom rule returns a boolean the user is allowed access if the rule
 *   returns true and an error is thrown if the rule returns false.
 * - If the custom rule returns null the field is set to null (make sure the
 *   field is nullable in the schema)
 * - If one param returns false and another returns null, an error will be
 *   thrown and the null ignored.
 */
export type CustomMutationAuthorizationFunction = (
  context: AccessControlContext,
  args: Record<string, unknown>
) => boolean | null | Promise<boolean | null>;

/**
 * Adds an access control check to a query resolver as a middleware.
 *
 * Note that this middleware will run the protected resolver before the access
 * control check, so the resolver should be written to be safe to run even if
 * the user doesn't have access. The advantage is that you can inspect the
 * result of the resolver to make access control decisions.
 *
 * @param func The custom authorization function
 *
 * @see CustomQueryAuthorizationFunction
 */
export function CustomQueryAccessControl<
  RootType extends object = never,
  ResultType extends object = never,
>(
  func: CustomQueryAuthorizationFunction<RootType, ResultType>
): MethodDecorator {
  const middleware: MiddlewareFn<AuthorizationContext> = async (
    resolverData,
    next
  ) => {
    const { context, args, info } = resolverData;
    const root = resolverData.root as RootType;
    const { authorization } = context;

    if (authorization.accessLevel === AccessLevel.SuperAdmin) {
      // Super admins have access to everything
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return next();
    }

    let result = (await next()) as
      | ResultType
      | Option<ResultType>
      | ConcreteResult<ResultType>
      | ConcreteResult<Option<ResultType>>;
    if (Result.isResult(result)) {
      result = result.unwrapOr(None);
    }
    if (!Option.isOption(result)) {
      result = Some(result);
    }

    const customResult = await func(root, context, result, args);

    if (customResult === false) {
      return Err(new AccessControlError(info));
    } else if (customResult === null) {
      return null;
    }

    return result;
  };

  return UseMiddleware(middleware);
}

/**
 * Adds an access control check to a mutation resolver as a middleware.
 *
 * This middleware will wait to run the protected resolver until after the access
 * control check. This means the resolver will not run if the user does not have
 * access.
 */
export function CustomMutationAccessControl(
  func: CustomMutationAuthorizationFunction
): MethodDecorator {
  const middleware: MiddlewareFn<AuthorizationContext> = async (
    resolverData,
    next
  ) => {
    const { context, args, info } = resolverData;
    const { authorization } = context;

    if (authorization.accessLevel === AccessLevel.SuperAdmin) {
      // Super admins have access to everything
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return next();
    }

    const customResult = await func(context, args);

    if (customResult === false) {
      return Err(new AccessControlError(info));
    } else if (customResult === null) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return next();
  };

  return UseMiddleware(middleware);
}
