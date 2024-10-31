import type { Middleware } from "@koa/router";
import Router from "@koa/router";

export abstract class RouterService {
  private readonly localRouter: Router;
  constructor(path: string) {
    this.localRouter = new Router({ prefix: path });
  }

  public get routes() {
    return this.localRouter.routes();
  }

  protected addGetRoute(path: string, ...middleware: Middleware[]) {
    this.localRouter.get(path, ...middleware);
  }

  protected addPostRoute(path: string, ...middleware: Middleware[]) {
    this.localRouter.post(path, ...middleware);
  }

  protected addPutRoute(path: string, ...middleware: Middleware[]) {
    this.localRouter.put(path, ...middleware);
  }

  protected addDeleteRoute(path: string, ...middleware: Middleware[]) {
    this.localRouter.delete(path, ...middleware);
  }

  protected addPatchRoute(path: string, ...middleware: Middleware[]) {
    this.localRouter.patch(path, ...middleware);
  }

  protected addUseRoute(path: string, ...middleware: Middleware[]) {
    this.localRouter.use(path, ...middleware);
  }
}
