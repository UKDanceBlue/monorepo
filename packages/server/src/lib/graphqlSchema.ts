import { Container } from "@freshgum/typedi";
import type { AccessControlParam } from "@ukdanceblue/common";
import { AccessLevel, checkParam } from "@ukdanceblue/common";
import {
  ConcreteError,
  FormattedConcreteError,
  toBasicError,
} from "@ukdanceblue/common/error";
import type { GraphQLResolveInfo } from "graphql";
import { Err, Option, Result } from "ts-results-es";
import type { ArgsDictionary, MiddlewareFn } from "type-graphql";
import { buildSchema } from "type-graphql";
import { fileURLToPath } from "url";

import { logger } from "#logging/logger.js";
import type { GraphQLContext } from "#resolvers/context.js";

import { resolversList } from "./resolversList.js";

const schemaPath = fileURLToPath(
  import.meta.resolve("../../../../../schema.graphql")
);

/**
 * Logs errors, as well as allowing us to return results and options from resolvers
 *
 * NOTE: be careful working in this function as the types are mostly 'any', meaning you won't get much type checking
 */
const errorHandlingMiddleware: MiddlewareFn = async ({ info }, next) => {
  let result: unknown;
  try {
    result = (await next()) as unknown;
  } catch (error) {
    logger.error(
      "An error occurred in a resolver",
      typeof error !== "object" ? { error } : error
    );
    throw error;
  }

  if (Result.isResult(result)) {
    if (result.isErr()) {
      let concreteError: Err<ConcreteError>;
      let stack: string | undefined;
      if (result.error instanceof ConcreteError) {
        concreteError = result;
        stack = result.stack;
      } else {
        concreteError = Err(toBasicError(result.error));
        stack = concreteError.error.stack;
      }

      const error = new FormattedConcreteError(concreteError, info);
      logger.error(
        `An error occurred in a resolver: ${concreteError.error.detailedMessage}\nStack: ${stack && stack.length > 0 ? `${stack.slice(0, 1000)}...` : stack}`
      );
      throw error;
    } else {
      result = result.value as unknown;
    }
  }

  if (Option.isOption(result)) {
    result = result.unwrapOr(null);
  }

  return result;
};

for (const service of resolversList) {
  try {
    // @ts-expect-error This is a valid operation
    Container.get(service);
  } catch (error) {
    logger.crit(`Failed to get service: "${service.name}"`, error);
    process.exit(1);
  }
}

export default await buildSchema({
  resolvers: resolversList,
  emitSchemaFile: schemaPath,
  authChecker<RootType extends object>(
    resolverData: {
      root: RootType;
      args: ArgsDictionary;
      context: GraphQLContext;
      info: GraphQLResolveInfo;
    },
    params: AccessControlParam<RootType>[]
  ): boolean {
    const { context, args, root } = resolverData;
    const { authorization } = context;

    if (authorization.accessLevel === AccessLevel.SuperAdmin) {
      return true;
    }

    let ok = false;

    for (const rule of params) {
      const result = checkParam<RootType>(
        rule,
        authorization,
        root,
        args,
        context
      );
      if (result.isErr()) {
        throw new Error(result.error.detailedMessage);
      }

      ok = result.value;
      if (ok) {
        break;
      }
    }

    return ok;
  },
  globalMiddlewares: [errorHandlingMiddleware],
  container: {
    get(someClass) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
      return Container.get(someClass, false);
    },
  },
  validate: true,
});
