import http from "node:http";

import { Container, Service } from "@freshgum/typedi";
import { setupExpressErrorHandler } from "@sentry/node";
import { ConcreteError, ErrorCode } from "@ukdanceblue/common/error";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { formatError } from "#lib/formatError.js";
import { logger } from "#lib/logging/standardLogging.js";
import type { SyslogLevels } from "#lib/logging/SyslogLevels.js";
import {
  applicationPortToken,
  cookieSecretToken,
  isDevelopmentToken,
  loggingLevelToken,
} from "#lib/typediTokens.js";
import { SessionRepository } from "#repositories/Session.js";

@Service(
  {
    scope: "singleton",
  },
  [
    SessionRepository,
    applicationPortToken,
    loggingLevelToken,
    isDevelopmentToken,
    cookieSecretToken,
  ]
)
export class ExpressModule {
  #app?: express.Application;
  #httpServer?: http.Server;
  #middlewaresLoaded = false;

  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly applicationPort: number,
    private readonly loggingLevel: SyslogLevels,
    private readonly isDevelopment: boolean,
    private readonly cookieSecret: string
  ) {}

  async init(): Promise<void> {
    this.#app = express();
    this.#app.set("trust proxy", true);

    this.#httpServer = http.createServer(this.app);

    // eslint-disable-next-line unicorn/no-useless-promise-resolve-reject
    return Promise.resolve();
  }

  public startMiddlewares() {
    if (this.loggingLevel === "trace") {
      this.app.use((req, _res, next) => {
        logger.trace("request received", {
          method: req.method,
          url: req.url,
        });
        next();
      });
    }
    this.app.use((req, _, next) => {
      req.getService = Container.get.bind(Container);
      next();
    });
    this.app.use(
      cors({
        credentials: true,
        origin: this.isDevelopment
          ? [/^https:\/\/(\w+\.)?danceblue\.org$/, /^http:\/\/localhost:\d+$/]
          : /^https:\/\/(\w+\.)?danceblue\.org$/,
      })
    );
    this.app.use(cookieParser(this.cookieSecret));
    this.app.use(this.sessionRepository.expressMiddleware);

    this.#middlewaresLoaded = true;
  }

  public async startRoutes() {
    if (!this.middlewaresLoaded) {
      throw new Error("Middlewares not loaded");
    }

    const apiRouter = express.Router();

    const { default: authApiRouter } = await import(
      "#routes/api/auth/index.js"
    );
    const { default: eventsApiRouter } = await import(
      "#routes/api/events/index.js"
    );
    const { default: healthCheckRouter } = await import(
      "#routes/api/healthcheck/index.js"
    );
    const { default: fileRouter } = await import("#routes/api/file/index.js");
    const { default: uploadRouter } = await import(
      "#routes/api/upload/index.js"
    );

    Container.get(authApiRouter).mount(apiRouter);
    Container.get(eventsApiRouter).mount(apiRouter);
    Container.get(healthCheckRouter).mount(apiRouter);
    Container.get(fileRouter).mount(apiRouter);
    Container.get(uploadRouter).mount(apiRouter);

    this.app.use("/api", apiRouter);
  }

  public startErrorHandlers() {
    setupExpressErrorHandler(this.app, {
      shouldHandleError(error) {
        if (
          error instanceof ConcreteError &&
          [
            ErrorCode.AccessControlError,
            ErrorCode.AuthorizationRuleFailed,
            ErrorCode.NotFound,
            ErrorCode.Unauthenticated,
          ].includes(error.tag)
        ) {
          return false;
        }
        return true;
      },
    });
    this.app.use(this.expressErrorHandler.bind(this));
  }

  public async start(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.httpServer.on("error", reject);
      this.httpServer.listen(this.applicationPort, () => {
        this.httpServer.off("error", reject);
        resolve();
      });
    });
  }

  public get app(): express.Application {
    if (!this.#app) {
      throw new Error("ExpressModule not started");
    }
    return this.#app;
  }
  public get httpServer(): http.Server {
    if (!this.#httpServer) {
      throw new Error("ExpressModule not started");
    }
    return this.#httpServer;
  }
  public get middlewaresLoaded(): boolean {
    return this.#middlewaresLoaded;
  }

  private expressErrorHandler(
    err: unknown,
    _r: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.headersSent) {
      return next(err);
    }

    const formatted = formatError(
      err instanceof Error
        ? err
        : err instanceof ConcreteError
          ? err.graphQlError
          : new Error(String(err)),
      err,
      this.isDevelopment
    );
    if (
      formatted.extensions &&
      "code" in formatted.extensions &&
      formatted.extensions.code === ErrorCode.Unauthenticated.description
    ) {
      res.status(401).json(formatted);
    } else {
      logger.error("Unhandled error in Express", { error: formatted });
      res.status(500).json(formatted);
    }
  }
}
