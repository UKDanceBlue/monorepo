import http from "node:http";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import cors from "@koa/cors";
import Router from "@koa/router";
import type { DefaultState } from "koa";
import Koa from "koa";
import { koaBody } from "koa-body";

import { logDebug, logError, logInfo, logWarning } from "./logger.js";
import type { GraphQLContext } from "./resolvers/context.js";
import eventsApiRouter from "./routes/api/events/index.js";

// const BASIC_LOGGING: ApolloServerPlugin<BaseContext> = {
//   async requestDidStart(requestContext) {
//     logDebug(`request started:\n${requestContext.request.query}`, {
//       variables: requestContext.request.variables,
//     });
//     const listener: GraphQLRequestListener<BaseContext> = {
//       async didEncounterErrors(requestContext) {
//         logInfo(
//           `an error happened in response to query: ${requestContext.request.query}`,
//           { errors: requestContext.errors }
//         );
//       },
//       async willSendResponse(requestContext) {
//         logDebug("response sent", { response: requestContext.response });
//       },
//     };

//     return listener;
//   },
// };

/**
 * Create the Koa, HTTP, and Apollo servers
 *
 * @return The Koa, HTTP, and Apollo servers
 */
export async function createServer() {
  const { default: graphqlSchema } = await import("./lib/graphqlSchema.js");
  const { formatError } = await import("./lib/formatError.js");

  const app = new Koa();
  app.silent = true;
  app.on("error", (err, ctx) => {
    logError("Koa app error", err, ctx);
  });

  const httpServer = http.createServer(app.callback());

  // Set up Apollo Server
  const server = new ApolloServer<GraphQLContext>({
    schema: graphqlSchema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }) /* , BASIC_LOGGING*/,
    ],
    logger: {
      debug: logDebug,
      info: logInfo,
      warn: logWarning,
      error: logError,
    },
    status400ForVariableCoercionErrors: true,
    formatError(formatted, error) {
      return formatError(formatted, error, true);
    },
  });

  app.use(cors());

  return { app, httpServer, apolloServer: server };
}

/**
 * Start the HTTP server
 *
 * @param httpServer The HTTP server to start
 */
export async function startHttpServer(httpServer: http.Server) {
  await new Promise<void>((resolve, reject) => {
    httpServer.on("error", reject);
    httpServer.listen({ port: 4000 }, () => {
      httpServer.off("error", reject);
      resolve();
    });
  });
}

/**
 * Start the Apollo Server
 *
 * @param apolloServer The Apollo Server instance
 * @param app The Koa app instance
 */
export async function startServer(
  apolloServer: ApolloServer<GraphQLContext>,
  app: Koa
) {
  await apolloServer.start();

  const { default: authApiRouter } = await import("./routes/api/auth/index.js");
  const { graphqlContextFunction } = await import("./resolvers/context.js");

  const apiRouter = new Router<DefaultState, GraphQLContext>();
  app.use(apiRouter.routes());

  apiRouter.all(
    "/graphql",
    koaBody({
      patchNode: true,
      text: false,
      urlencoded: false,
    }),
    koaMiddleware<DefaultState, GraphQLContext>(
      // @ts-expect-error This is a bug in the type definitions
      apolloServer,
      {
        context: graphqlContextFunction,
      }
    )
  );
  apiRouter.use("/api", authApiRouter.routes(), eventsApiRouter.routes());
}
