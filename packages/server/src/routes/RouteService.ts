import type { RequestHandler } from "express";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

function defaultErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  res.status(500).send({ error: err.message });
}

export abstract class RouterService {
  private readonly localRouter: Router;
  constructor(private path: string) {
    this.localRouter = Router();
  }

  public mount(parent: Router) {
    parent.use(this.path, this.localRouter, defaultErrorHandler);
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
