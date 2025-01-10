import { getRouterManifest } from "@tanstack/start/router-manifest";
import {
  createRequestHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";

import { createRouter } from "./router";

export async function render(opts: {
  url: string;
  head: string;
  req: Request;
}) {
  return createRequestHandler({
    createRouter,
    request: opts.req,
    getRouterManifest,
  })(defaultStreamHandler);
}
