import {
  ApolloServer,
  type ApolloServerPlugin,
  type GraphQLRequestListener,
} from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Service } from "@freshgum/typedi";

import type { GraphQLContext } from "#auth/context.js";
import { formatError } from "#lib/formatError.js";
import { logger } from "#lib/logging/standardLogging.js";
import type { SyslogLevels } from "#lib/logging/SyslogLevels.js";
import { isDevelopmentToken, loggingLevelToken } from "#lib/typediTokens.js";

import { ExpressModule } from "./Express.js";

@Service([ExpressModule, loggingLevelToken, isDevelopmentToken])
export class ApolloModule {
  private readonly apolloServer: ApolloServer<GraphQLContext>;

  constructor(
    private readonly expressModule: ExpressModule,
    private readonly loggingLevel: SyslogLevels,
    private readonly isDevelopment: boolean
  ) {
    const apolloServerPlugins = [
      ApolloServerPluginDrainHttpServer({
        httpServer: expressModule.httpServer,
      }),
    ];
    if (loggingLevel === "trace") {
      logger.warning(
        "Apollo Server is running in trace mode, make sure to limit the number of requests you make as the logs will get big quickly. TURN OFF SCHEMA REFRESH IN GRAPHQL PLAYGROUND."
      );
      apolloServerPlugins.push(basicLoggingPlugin);
    }
    // Set up Apollo Server
    this.apolloServer = new ApolloServer<GraphQLContext>({
      introspection: true,
      schema: graphqlSchema,
      plugins: apolloServerPlugins,
      logger: {
        debug: logger.debug,
        info: logger.info,
        warn: logger.warning,
        error: logger.error,
      },
      status400ForVariableCoercionErrors: true,
      formatError(formatted, error) {
        return formatError(formatted, error, isDevelopment);
      },
    });
  }
}

const basicLoggingPlugin: ApolloServerPlugin = {
  requestDidStart(requestContext) {
    logger.trace(`graphQL request started:\n${requestContext.request.query}`, {
      variables: requestContext.request.variables,
    });
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
