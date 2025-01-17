import { Container, Service, type ServiceIdentifier } from "@freshgum/typedi";
import type { AccessControlParam, Action } from "@ukdanceblue/common";
import { AccessLevel, isGlobalId } from "@ukdanceblue/common";
import {
  ConcreteError,
  FormattedConcreteError,
  toBasicError,
} from "@ukdanceblue/common/error";
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  type GraphQLResolveInfo,
  type GraphQLSchema,
} from "graphql";
import type { Err } from "ts-results-es";
import { AsyncResult, Option, Result } from "ts-results-es";
import type { ArgsDictionary, NextFn, ResolverData } from "type-graphql";
import { buildSchema } from "type-graphql";
import { fileURLToPath } from "url";

import type { GraphQLContext } from "#lib/auth/context.js";
import { logger } from "#logging/logger.js";

const schemaPath = fileURLToPath(
  import.meta.resolve("../../../../../schema.graphql")
);

function pathToString(path: GraphQLResolveInfo["path"]): string {
  let current: GraphQLResolveInfo["path"] | undefined = path;
  let result = "";
  while (current) {
    result = `${current.key}.${result}`;
    current = current.prev;
  }
  return result;
}

@Service(
  {
    scope: "singleton",
  },
  []
)
export class SchemaService {
  #schema?: GraphQLSchema;

  public async init(): Promise<void> {
    const { resolversList } = await import("#lib/resolversList.js");

    for (const service of resolversList) {
      try {
        Container.get(service as ServiceIdentifier);
      } catch (error) {
        logger.crit(`Failed to get service: "${service.name}"`, { error });
        process.exit(1);
      }
    }

    this.#schema = await buildSchema({
      resolvers: resolversList,
      emitSchemaFile: schemaPath,
      authChecker: this.authChecker.bind(this),
      globalMiddlewares: [this.errorHandler.bind(this)],
      container: {
        get(someClass) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
          return Container.get(someClass, false);
        },
      },
      validate: true,
    });
  }

  /**
   * Logs errors, as well as allowing us to return results and options from resolvers
   *
   * NOTE: be careful working in this function as the types are mostly 'any', meaning you won't get much type checking
   */
  private async errorHandler(
    { info }: ResolverData<GraphQLContext>,
    next: NextFn
  ) {
    let result: // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    | {}
      | AsyncResult<unknown, unknown>
      | Result<unknown, unknown>
      | Option<unknown>
      | Result<Option<unknown>, unknown>
      | AsyncResult<Option<unknown>, unknown>
      | null;
    try {
      result = await next();
    } catch (error) {
      logger.error(
        "An error occurred in a resolver",
        typeof error !== "object" ? { error } : error
      );
      throw error;
    }

    if (result instanceof AsyncResult) {
      result = await result.promise;
    }

    if (Result.isResult(result)) {
      if (result.isErr()) {
        let concreteError: Err<ConcreteError>;
        let stack: string | undefined;
        if (result.error instanceof ConcreteError) {
          concreteError = result as Err<ConcreteError>;
          stack = result.stack;
        } else {
          concreteError = result.mapErr(toBasicError);
          stack = concreteError.stack;
        }

        const error = new FormattedConcreteError(concreteError, info);
        logger.error(
          `An error occurred in a resolver: ${concreteError.error.detailedMessage}\nStack: ${stack && stack.length > 0 ? `${stack.slice(0, 1000)}...` : stack}`
        );
        throw error;
      } else {
        result = result.value;
      }
    }

    if (Option.isOption(result)) {
      result = result.unwrapOr(null);
    }

    return result;
  }

  private authChecker(
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
      root,
      info: { parentType, returnType, variableValues, path },
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
        const ok = ability.can(...rule);
        logger.trace("Checking access control", {
          rule: ability.relevantRuleFor(...rule),
          authorized: ok,
          canParameters: rule,
        });
      }

      let action: Action;
      let subject: string | undefined = undefined;
      let field: string | undefined = undefined;

      if (rule.length === 1) {
        [action] = rule;
      } else {
        [action, , field] = rule;
        subject = rule[1] as string;
      }

      if (!field) {
        field = ".";
      }

      let id: string | undefined = undefined;
      let idTypename: string | undefined = undefined;
      if (
        parentType.name === "Query" ||
        parentType.name === "Mutation" ||
        parentType.name === "Subscription"
      ) {
        if ("id" in variableValues) {
          if (typeof variableValues.id === "string") {
            id = variableValues.id;
          } else if (isGlobalId(variableValues.id)) {
            id = variableValues.id.id;
            idTypename = variableValues.id.typename;
          } else {
            throw new Error("Cannot determine ID for query");
          }
        } else {
          const possibleIds = Object.values(variableValues).filter((value) =>
            isGlobalId(value)
          );
          if (possibleIds.length === 1) {
            id = possibleIds[0]!.id;
          } else {
            const idx = possibleIds.findIndex(
              (value) => value.typename === "PersonNode"
            );
            if (idx !== -1) {
              possibleIds.splice(idx, 1);
            }
            if (possibleIds.length > 1) {
              throw new Error("Cannot determine ID for query");
            }
          }
        }
      } else if ("id" in root) {
        if (typeof root.id === "string") {
          id = root.id;
        } else if (isGlobalId(root.id)) {
          id = root.id.id;
          idTypename = root.id.typename;
        } else {
          throw new Error("Cannot determine ID for query");
        }
      }

      if (subject === "all") {
        return ability.can(action, "all", field);
      }

      if (!subject) {
        let rt = returnType;
        if (rt instanceof GraphQLNonNull) {
          rt = rt.ofType;
        }
        if (rt instanceof GraphQLObjectType) {
          if (
            rt
              .getInterfaces()
              .some(({ name }) => name === "AbstractGraphQLPaginatedResponse")
          ) {
            const { data } = rt.getFields();
            if (data) {
              rt = data.type;
            }
          }
        }
        if (rt instanceof GraphQLNonNull) {
          rt = rt.ofType;
        }
        if (rt instanceof GraphQLList) {
          rt = rt.ofType;
        }
        if (rt instanceof GraphQLNonNull) {
          rt = rt.ofType;
        }
        if (rt instanceof GraphQLObjectType) {
          subject = rt.name;
        }
      }

      if (subject === "Node") {
        if (!idTypename) {
          throw new Error("Cannot determine ID type for node-returning query");
        }
        subject = idTypename;
      }

      if (!subject) {
        throw new Error(
          `Cannot determine subject type for query ${pathToString(path)}`
        );
      }

      const ok = ability.can(
        action,
        {
          kind: subject as never,
          id,
        },
        field
      );
      logger.trace("Checking access control", {
        rule: ability.relevantRuleFor(action, subject as never, field),
        authorized: ok,
        id,
        action,
        subject,
        field,
      });
      return ok;
    } else {
      logger.error("Invalid access control rule", { params });
      throw new Error("Invalid access control rule");
    }
  }

  get schema(): GraphQLSchema {
    if (!this.#schema) {
      throw new Error("SchemaService not initialized");
    } else {
      return this.#schema;
    }
  }
}
