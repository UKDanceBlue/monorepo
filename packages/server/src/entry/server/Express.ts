import http, { STATUS_CODES } from "node:http";

import { Container, Service } from "@freshgum/typedi";
import { captureException, setupExpressErrorHandler } from "@sentry/node";
import {
  ErrorCode,
  ErrorType,
  ExtendedError,
  InvariantError,
} from "@ukdanceblue/common/error";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { formatError } from "#lib/formatError.js";
import { logError } from "#lib/logging/logger.js";
import { logger } from "#lib/logging/standardLogging.js";
import {
  applicationPortToken,
  cookieSecretToken,
  isDevelopmentToken,
} from "#lib/typediTokens.js";
import { SessionRepository } from "#repositories/Session.js";

@Service(
  {
    scope: "singleton",
  },
  [
    SessionRepository,
    applicationPortToken,
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
    private readonly isDevelopment: boolean,
    private readonly cookieSecret: string
  ) {}

  init() {
    this.#app = express();
    this.#app.set("trust proxy", true);

    this.#httpServer = http.createServer(this.app);
  }

  public startMiddlewares() {
    this.app.use((req, _res, next) => {
      logger.trace("request received", {
        method: req.method,
        url: req.url,
      });
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
          error instanceof ExtendedError &&
          [
            ErrorCode.NotFound,
            ErrorCode.Unauthenticated,
            ErrorCode.Unauthorized,
            ErrorCode.ActionDenied,
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
        const httpServerAddress = this.httpServer.address();
        let httpServerUrl = "";
        if (typeof httpServerAddress === "string") {
          httpServerUrl = httpServerAddress;
        } else if (httpServerAddress) {
          httpServerUrl =
            httpServerAddress.address === "::" ||
            httpServerAddress.address === ""
              ? `http://localhost:${httpServerAddress.port}`
              : `http://${httpServerAddress.address}:${httpServerAddress.port}`;
        }

        logger.info(`HTTP server started at ${httpServerUrl}`);
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
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.headersSent) {
      return next(err);
    }

    const formatted = formatError(
      err instanceof Error ? err : new Error(String(err)),
      err,
      this.isDevelopment
    );

    let code: number;
    let expose = false;
    if (err instanceof ExtendedError) {
      expose = err.expose;
      switch (err.type) {
        case ErrorType.BadRequest: {
          code = 400;
          break;
        }
        case ErrorType.Unauthenticated: {
          // Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
          code = 401;
          break;
        }
        case ErrorType.Unauthorized: {
          code = 403;
          break;
        }
        case ErrorType.NotFound: {
          code = 404;
          break;
        }
        default: {
          err.type satisfies never;
          logError(new InvariantError("Unhandled error tag"));
          // fallthrough
        }
        case ErrorType.Internal: {
          captureException(err);
          code = 500;
          break;
        }
      }
    } else {
      code = 500;
      expose = false;
      captureException(err);
    }

    res.status(code);

    if (this.isDevelopment || expose) {
      if (req.accepts("html")) {
        res
          .type("html")
          .send(
            `<h1>${code} ${STATUS_CODES[code]}</h1><p>${formatted.message}</p><code><pre>${JSON.stringify(formatted, null, 2)}</pre></code>`
          );
      } else if (req.accepts("json")) {
        res.json({ error: formatted });
      } else {
        res.type("txt").send(formatted.message);
      }
    } else if (req.accepts("html")) {
      res
        .type("html")
        .send(
          `<h1>${code} ${STATUS_CODES[code]}</h1><p>${formatted.message}</p>`
        );
    } else if (req.accepts("json")) {
      res.json({ error: { message: formatted.message } });
    } else {
      res.type("txt").send(formatted.message);
    }
  }
}
