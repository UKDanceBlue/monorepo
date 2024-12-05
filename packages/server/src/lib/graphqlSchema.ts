/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Container } from "@freshgum/typedi";
import type { AccessControlParam, Action } from "@ukdanceblue/common";
import { AccessLevel, parseGlobalId } from "@ukdanceblue/common";
import {
  ConcreteError,
  FormattedConcreteError,
  toBasicError,
} from "@ukdanceblue/common/error";
import {
  GraphQLList,
  GraphQLObjectType,
  type GraphQLResolveInfo,
} from "graphql";
import { Err, Option, Result } from "ts-results-es";
import type { ArgsDictionary, MiddlewareFn } from "type-graphql";
import { buildSchema } from "type-graphql";
import { fileURLToPath } from "url";

import type { GraphQLContext } from "#lib/auth/context.js";
import { logger } from "#logging/logger.js";

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
  authChecker(
    resolverData: {
      root: Record<string, unknown>;
      args: ArgsDictionary;
      context: GraphQLContext;
      info: GraphQLResolveInfo;
    },
    params: AccessControlParam[]
  ): boolean {
    const {
      context,
      info: { parentType, returnType, fieldName },
      root,
    } = resolverData;
    const { accessLevel, ability } = context;

    if (accessLevel === AccessLevel.SuperAdmin) {
      return true;
    }

    if (params.length === 0) {
      return true;
    } else if (params.length === 1) {
      const [rule] = params as [AccessControlParam];

      if (rule.length !== 1 && typeof rule[1] !== "string") {
        return ability.can(...rule);
      }

      let action: Action;
      let subject: string | undefined = undefined;
      let field: string | undefined = undefined;
      let childOfType: string | undefined = undefined;
      let childOfId: string | undefined = undefined;

      if (rule.length === 1) {
        [action] = rule;
      } else {
        [action, , field] = rule;
        subject = rule[1] as string;
      }

      if (
        parentType.name !== "Query" &&
        parentType.name !== "Mutation" &&
        parentType.name !== "Subscription"
      ) {
        if (!field) {
          field = fieldName;
        }
        childOfType = parentType.name;
        if ("id" in root) {
          if (typeof root.id === "string") {
            childOfId = root.id;
          } else {
            const parentId = parseGlobalId(String(root.id));
            if (parentId.isOk()) {
              childOfId = parentId.value.id;
            } else {
              throw new Error("Cannot determine parent ID for query");
            }
          }
        } else {
          throw new Error("Cannot determine parent ID for query");
        }
      }

      if (subject === "all") {
        return ability.can(action as typeof Action.Read, "all", field);
      }

      if (!subject) {
        if (returnType instanceof GraphQLObjectType) {
          subject = returnType.name;
        } else if (returnType instanceof GraphQLList) {
          if (returnType.ofType instanceof GraphQLObjectType) {
            subject = returnType.ofType.name;
          }
        }
      }
      if (!subject) {
        throw new Error("Cannot determine subject type for query");
      }

      return ability.can(
        action as typeof Action.Read,
        {
          kind: subject as "FundraisingAssignmentNode",
          id: (root as any).id,
          childOfId,
          childOfType: childOfType as "FundraisingAssignmentNode",
          ownedByUserIds: [],
          withinTeamIds: [],
        },
        field
      );
    } else {
      throw new Error("Invalid access control rule");
    }
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
