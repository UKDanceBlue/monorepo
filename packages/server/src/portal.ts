import type * as express from "express";
import { extname } from "path";
import type { ViteDevServer } from "vite";

import { logger } from "#lib/logging/standardLogging.js";

type RenderFunction = (options: {
  req: express.Request;
  res: express.Response;
  head: string;
}) => Promise<void>;

export async function mountPortal(
  app: express.Application,
  isProd: boolean,
  root: string,
  hmrPort: number
) {
  logger.debug("Mounting Portal");
  let vite: ViteDevServer | undefined = undefined;
  if (!isProd) {
    vite = await initializeViteServer(root, hmrPort, app);
    logger.info("Vite dev server initialized");
  }

  const entryPoint = await getEntryPoint(vite);

  app.use("*", async (req, res, next) => {
    try {
      logger.debug("Rendering Portal");
      const url = req.originalUrl;

      if (extname(url) !== "") {
        console.warn(`${url} is not valid router path`);
        res.status(404);
        res.end(`${url} is not valid router path`);
        return;
      }

      // Best effort extraction of the head from vite's index transformation hook
      let viteHead = !isProd ? `<html><head></head><body></body></html>` : "";

      viteHead = viteHead.substring(
        viteHead.indexOf("<head>") + 6,
        viteHead.indexOf("</head>")
      );

      await entryPoint
        .render({ req, res, head: viteHead })
        .then(() => {
          logger.debug("Portal rendered");
        })
        .catch((error) => next(error));
    } catch (error) {
      const localError =
        error instanceof Error
          ? error
          : new Error(String(error), { cause: error });
      vite?.ssrFixStacktrace(localError);
      console.info(localError.stack);
      res.status(500).end(localError.stack);
    }
  });

  logger.info("Mounted Portal");
}
async function initializeViteServer(
  root: string,
  hmrPort: number,
  app: express.Application
) {
  const { createServer } = await import("vite");
  logger.debug("Initializing Vite dev server");
  const vite = await createServer({
    root,
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100,
      },
      hmr: {
        port: hmrPort,
      },
    },
    appType: "custom",
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);
  return vite;
}

async function getEntryPoint(
  vite: ViteDevServer | undefined
): Promise<{ render: RenderFunction }> {
  if (!vite) {
    logger.debug("Importing pre-built SSR entry point");
    return import("@ukdanceblue/portal/server/entry-server.js") as Promise<{
      render: RenderFunction;
    }>;
  } else {
    logger.debug("Loading SSR entry point from Vite");
    const entry = await vite.ssrLoadModule(
      "@ukdanceblue/portal/src/entry-server.tsx"
    );
    return entry as { render: RenderFunction };
  }
}
