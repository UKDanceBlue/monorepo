import http from "node:http";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";

import { formatError } from "./lib/formatError.js";
import graphqlSchema from "./lib/graphqlSchema.js";
import { logDebug, logError, logInfo, logWarning } from "./logger.js";


/**
 * Create the Koa, HTTP, and Apollo servers
 *
 * @return The Koa, HTTP, and Apollo servers
 */
export function createServer() {
  const app = new Koa();
  app.silent = true;
  app.on("error", (err, ctx) => {
    logError("Koa app error", err, ctx);
  });

  const httpServer = http.createServer(app.callback());

  // Set up Apollo Server
  const server = new ApolloServer({
    schema: graphqlSchema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    logger: {
      debug: logDebug,
      info: logInfo,
      warn: logWarning,
      error: logError,
    },
    status400ForVariableCoercionErrors: true,
    formatError(formatted, error) {
      return formatError(formatted, error, false);
    },
  });

  app.use(cors());
  app.use(bodyParser());

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
export async function startServer(apolloServer: ApolloServer, app: Koa) {
  await apolloServer.start();
  app.use(
    // @ts-expect-error The context type is not correct
    koaMiddleware(apolloServer, {
      context: ({ ctx }) => Promise.resolve({ token: ctx.headers.token }),
    })
  );
}
