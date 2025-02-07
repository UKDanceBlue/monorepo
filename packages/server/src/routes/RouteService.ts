import type { RequestHandler } from "express";
import { Router } from "express";

import { logger } from "#lib/logging/standardLogging.js";

export abstract class RouterService {
  private readonly localRouter: Router;
  constructor(private path: string) {
    this.localRouter = Router();
  }

  public mount(parent: Router) {
    parent.use(
      this.path,
      (req, _res, next) => {
        logger.trace(`Handling request with API path ${this.path}`, {
          method: req.method,
          url: req.url,
        });
        next();
      },
      this.localRouter
    );
  }

  protected addGetRoute(path: string, ...middleware: RequestHandler[]) {
    this.localRouter.get(path, ...middleware);
  }

  protected addPostRoute(path: string, ...middleware: RequestHandler[]) {
    this.localRouter.post(path, ...middleware);
  }

  protected addPutRoute(path: string, ...middleware: RequestHandler[]) {
    this.localRouter.put(path, ...middleware);
  }

  protected addDeleteRoute(path: string, ...middleware: RequestHandler[]) {
    this.localRouter.delete(path, ...middleware);
  }

  protected addPatchRoute(path: string, ...middleware: RequestHandler[]) {
    this.localRouter.patch(path, ...middleware);
  }

  protected addUseRoute(path: string, ...middleware: RequestHandler[]) {
    this.localRouter.use(path, ...middleware);
  }
}
