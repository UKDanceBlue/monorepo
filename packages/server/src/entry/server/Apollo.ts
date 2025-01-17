import {
  ApolloServer,
  type ApolloServerPlugin,
  type GraphQLRequestListener,
} from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Service } from "@freshgum/typedi";
import express from "express";
import type { GraphQLFormattedError } from "graphql";

import type { GraphQLContext } from "#auth/context.js";
import { formatError } from "#lib/formatError.js";
import { SchemaService } from "#lib/graphqlSchema.js";
import { logger } from "#lib/logging/standardLogging.js";
import type { SyslogLevels } from "#lib/logging/SyslogLevels.js";
import { isDevelopmentToken, loggingLevelToken } from "#lib/typediTokens.js";

import { ExpressModule } from "./Express.js";

@Service(
  {
    scope: "singleton",
  },
  [ExpressModule, SchemaService, loggingLevelToken, isDevelopmentToken]
)
export class ApolloModule {
  #apolloServer?: ApolloServer<GraphQLContext>;

  constructor(
    private readonly expressModule: ExpressModule,
    private readonly schemaService: SchemaService,
    private readonly loggingLevel: SyslogLevels,
    private readonly isDevelopment: boolean
  ) {}

  public async init(): Promise<void> {
    await this.schemaService.init();

    // Set up Apollo Server
    this.#apolloServer = new ApolloServer<GraphQLContext>({
      introspection: true,
      schema: this.schemaService.schema,
      plugins: [
        ApolloServerPluginDrainHttpServer({
          httpServer: this.expressModule.httpServer,
        }),
      ],
      logger: {
        debug: logger.debug,
        info: logger.info,
        warn: logger.warning,
        error: logger.error,
      },
      status400ForVariableCoercionErrors: true,
      formatError: this.formatError.bind(this),
    });

    if (this.loggingLevel === "trace") {
      logger.warning(
        "Apollo Server is running in trace mode, make sure to limit the number of requests you make as the logs will get big quickly. TURN OFF SCHEMA REFRESH IN GRAPHQL PLAYGROUND."
      );
      this.#apolloServer.addPlugin(this.basicLoggingPlugin);
    }
  }

  private formatError(formatted: GraphQLFormattedError, error: unknown) {
    return formatError(formatted, error, this.isDevelopment);
  }

  public async start(): Promise<void> {
    await this.apolloServer.start();
    const { authenticate } = await import("#lib/auth/context.js");

    this.expressModule.app.use(
      "/graphql",

      express.json(),

      expressMiddleware<GraphQLContext>(this.apolloServer, {
        context: authenticate,
      })
    );
  }

  public get apolloServer(): ApolloServer<GraphQLContext> {
    if (!this.#apolloServer) {
      throw new Error("ApolloModule not started");
    }
    return this.#apolloServer;
  }

  private basicLoggingPlugin: ApolloServerPlugin = {
    requestDidStart(requestContext) {
      logger.trace(
        `graphQL request started:\n${requestContext.request.query}`,
        {
          variables: requestContext.request.variables,
        }
      );
      const listener: GraphQLRequestListener<GraphQLContext> = {
        didEncounterErrors(requestContext) {
          logger.info(
            `an error happened in response to graphQL query: ${requestContext.request.query}`,
            { errors: requestContext.errors }
          );
          return Promise.resolve();
        },
        willSendResponse(requestContext) {
          logger.trace("graphQL response sent", {
            response: requestContext.response.body,
          });
          return Promise.resolve();
        },
      };

      return Promise.resolve(listener);
    },
  };
}
