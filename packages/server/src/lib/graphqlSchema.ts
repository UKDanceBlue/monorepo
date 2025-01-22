import { Container, Service, type ServiceIdentifier } from "@freshgum/typedi";
import type { AccessControlParam, Action, Subject } from "@ukdanceblue/common";
import { AccessLevel } from "@ukdanceblue/common";
import {
  ConcreteError,
  FormattedConcreteError,
  toBasicError,
} from "@ukdanceblue/common/error";
import { type GraphQLResolveInfo, type GraphQLSchema } from "graphql";
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
          concreteError = result.mapErr((error) =>
            error instanceof ConcreteError ? error : toBasicError(error)
          );
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

  private async authChecker<S extends Exclude<Extract<Subject, string>, "all">>(
    resolverData: {
      root: Record<string, unknown>;
      args: ArgsDictionary;
      context: GraphQLContext;
      info: GraphQLResolveInfo;
    },
    params: AccessControlParam<S>[]
  ): Promise<boolean> {
    const { context, args, info, root } = resolverData;
    const { accessLevel, ability } = context;

    if (accessLevel === AccessLevel.SuperAdmin) {
      return true;
    }

    if (params.length === 0) {
      return true;
    } else if (params.length === 1 && params[0]) {
      const [rule] = params;

      const action: Action = rule[0];
      let subject: Subject;
      if (rule[1] === "all") {
        subject = rule[1];
      } else {
        const subjectOrCallback = rule[1];

        const subjectWrapper =
          typeof subjectOrCallback === "function"
            ? subjectOrCallback(info, args, root)
            : subjectOrCallback;

        let result;
        if (subjectWrapper instanceof AsyncResult) {
          result = await subjectWrapper.promise;
        } else if (typeof subjectWrapper === "string") {
          result = {
            kind: subjectWrapper,
          };
        } else {
          result = subjectWrapper;
        }

        let value;
        if (Result.isResult(result)) {
          if (result.isErr()) {
            return false;
          } else {
            value = result.value;
          }
        } else {
          value = result;
        }

        subject =
          typeof value === "object"
            ? {
                kind: value.kind,
                id: value.id,
              }
            : { kind: value };
      }

      const ok = ability.can(action, subject, rule[2]);

      logger.trace("Checking access control", {
        rule: ability.relevantRuleFor(rule[0], subject, rule[2]),
        authorized: ok,
        canParameters: rule,
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
