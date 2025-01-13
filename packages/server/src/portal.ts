import type * as express from "express";
import { extname } from "path";
import type { ViteDevServer } from "vite";

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
  let vite: ViteDevServer | undefined = undefined;
  if (!isProd) {
    vite = await initializeViteServer(root, hmrPort, app);
  }

  app.use("*", async (req, res) => {
    try {
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

      const entryPoint = await getEntryPoint(vite);

      entryPoint
        .render({ req, res, head: viteHead })
        .catch((error) => console.error(error));
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
}
async function initializeViteServer(
  root: string,
  hmrPort: number,
  app: express.Application
) {
  const { createServer } = await import("vite");
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
    return import("@ukdanceblue/portal/server/entry-server.js") as Promise<{
      render: RenderFunction;
    }>;
  } else {
    const entry = await vite.ssrLoadModule(
      "@ukdanceblue/portal/src/entry-server.tsx"
    );
    return entry as { render: RenderFunction };
  }
}
