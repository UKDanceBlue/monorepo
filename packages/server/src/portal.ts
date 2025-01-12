import type { render } from "@ukdanceblue/portal/server/entry-server.js";
import type { Application } from "express";
import { extname } from "path";
import type { ViteDevServer } from "vite";

export async function mountPortal(
  app: Application,
  isProd: boolean,
  root: string,
  hmrPort: number,
  isTest: boolean
) {
  let vite: ViteDevServer | undefined = undefined;
  if (!isProd) {
    const { createServer } = await import("vite");
    vite = await createServer({
      root,
      logLevel: isTest ? "error" : "info",
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
      let viteHead = !isProd
        ? await vite!.transformIndexHtml(
            url,
            `<html><head></head><body></body></html>`
          )
        : "";

      viteHead = viteHead.substring(
        viteHead.indexOf("<head>") + 6,
        viteHead.indexOf("</head>")
      );

      const entry = await (async () => {
        return !isProd
          ? (vite!.ssrLoadModule(
              import.meta.resolve("@ukdanceblue/portal/src/entry-server.tsx")
            ) as Promise<{ render: typeof render }>)
          : import("@ukdanceblue/portal/server/entry-server.js");
      })();

      console.info("Rendering:", url, "...");
      entry
        .render({ req, res, head: viteHead })
        .catch((error) => console.error(error));
    } catch (error) {
      const localError =
        error instanceof Error
          ? error
          : new Error(String(error), { cause: error });
      if (!isProd) vite!.ssrFixStacktrace(localError);
      console.info(localError.stack);
      res.status(500).end(localError.stack);
    }
  });
}
