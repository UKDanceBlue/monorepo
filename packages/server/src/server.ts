import { readFile } from "node:fs/promises";
import http from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from "@apollo/server";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Container } from "@freshgum/typedi";
import { setupExpressErrorHandler } from "@sentry/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import type {
  Application as ExpressApplication,
  NextFunction,
  Request,
  Response,
} from "express";
import express from "express";

import type { GraphQLContext } from "#auth/context.js";
import {
  applicationPortToken,
  isDevelopmentToken,
  loggingLevelToken,
} from "#lib/typediTokens.js";
import { logger } from "#logging/logger.js";

const applicationPort = Container.get(applicationPortToken);
const loggingLevel = Container.get(loggingLevelToken);

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

/**
 * Create the Koa, HTTP, and Apollo servers
 *
 * @return The Koa, HTTP, and Apollo servers
 */
export async function createServer() {
  const { default: graphqlSchema } = await import("./lib/graphqlSchema.js");
  const { formatError } = await import("./lib/formatError.js");

  const app = express();
  app.set("trust proxy", true);

  setupExpressErrorHandler(app);

  if (loggingLevel === "trace") {
    app.use((err: unknown, req: Request, _: unknown, next: NextFunction) => {
      logger.error("Koa app error", err, {
        method: req.method,
        url: req.url,
      });
      next(err);
    });
  }

  const httpServer = http.createServer(app);

  const apolloServerPlugins = [
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ];
  if (loggingLevel === "trace") {
    logger.warning(
      "Apollo Server is running in trace mode, make sure to limit the number of requests you make as the logs will get big quickly. TURN OFF SCHEMA REFRESH IN GRAPHQL PLAYGROUND."
    );
    apolloServerPlugins.push(basicLoggingPlugin);
  }
  // Set up Apollo Server
  const server = new ApolloServer<GraphQLContext>({
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
      return formatError(formatted, error, true);
    },
  });

  app.use(
    cors({
      credentials: true,
      origin: Container.get(isDevelopmentToken)
        ? [/^https:\/\/(\w+\.)?danceblue\.org$/, /^http:\/\/localhost:\d+$/]
        : /^https:\/\/(\w+\.)?danceblue\.org$/,
    })
  );

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
    httpServer.listen(applicationPort, () => {
      httpServer.off("error", reject);
      resolve();
    });
  });
}

/**
 * Start the Apollo Server
 *
 * @param apolloServer The Apollo Server instance
 * @param app The Express app instance
 */
export async function startServer(
  apolloServer: ApolloServer<GraphQLContext>,
  app: ExpressApplication
) {
  await apolloServer.start();

  if (loggingLevel === "trace") {
    app.use((req, _res, next) => {
      logger.trace("request received", {
        method: req.method,
        url: req.url,
      });
      next();
    });
  }

  const { default: authApiRouter } = await import("./routes/api/auth/index.js");
  const { default: eventsApiRouter } = await import(
    "./routes/api/events/index.js"
  );
  const { default: healthCheckRouter } = await import(
    "./routes/api/healthcheck/index.js"
  );
  const { default: fileRouter } = await import("./routes/api/file/index.js");
  const { default: uploadRouter } = await import(
    "./routes/api/upload/index.js"
  );
  const { authenticate } = await import("./lib/auth/context.js");

  app.use(cookieParser());

  app.use(
    "/graphql",

    express.json(),

    expressMiddleware<GraphQLContext>(apolloServer, {
      context: authenticate,
    })
  );
  const apiRouter = express.Router();

  Container.get(authApiRouter).mount(apiRouter);
  Container.get(eventsApiRouter).mount(apiRouter);
  Container.get(healthCheckRouter).mount(apiRouter);
  Container.get(fileRouter).mount(apiRouter);
  Container.get(uploadRouter).mount(apiRouter);

  app.use(
    "/api",
    apiRouter,
    (err: unknown, _: Request, res: Response, next: NextFunction) => {
      if (typeof err === "object" && err !== null && "message" in err) {
        const { message, ...errorData } = err;
        logger.error(String(message), { error: errorData });
        res.status(500).send(String(message));
      } else {
        logger.error("Unknown Error in API", { error: err });
        next(err);
      }
    }
  );

  const portalIndex = await (
    readFile(
      resolve(
        fileURLToPath(import.meta.resolve("@ukdanceblue/portal/index.html"))
      )
    ) as Promise<Awaited<ReturnType<typeof readFile>> | undefined>
  ).catch(() => undefined);

  if (portalIndex) {
    app.use(
      "/assets",
      express.static(
        resolve(
          fileURLToPath(import.meta.resolve("@ukdanceblue/portal/assets"))
        ),
        {}
      )
    );

    app.get("*", (_req, res) => {
      res.type("html");
      res.send(portalIndex);
    });
  }
}
