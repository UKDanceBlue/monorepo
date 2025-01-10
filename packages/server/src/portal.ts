import type { render } from "@ukdanceblue/portal/server/entry-server.js";
import type { Router } from "express";
import type { ViteDevServer } from "vite";

export async function mountPortal(
  router: Router,
  isProd: boolean,
  root: string,
  hmrPort: number,
  isTest: boolean
) {
  let vite: ViteDevServer;
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
    router.use(vite.middlewares);
  }

  router.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      if (url.includes(".")) {
        console.warn(`${url} is not valid router path`);
        res.status(404);
        res.end(`${url} is not valid router path`);
        return;
      }

      // Extract the head from vite's index transformation hook
      let viteHead = !isProd
        ? await vite.transformIndexHtml(
            url,
            `<html><head></head><body></body></html>`
          )
        : "";

      viteHead = viteHead.substring(
        viteHead.indexOf("<head>") + 6,
        viteHead.indexOf("</head>")
      );

      const entry = (await (async () => {
        return !isProd
          ? vite.ssrLoadModule(
              import.meta.resolve("@ukdanceblue/portal/src/entry-server.tsx")
            )
          : import("@ukdanceblue/portal/server/entry-server.js");
      })()) as { render: typeof render };

      console.info("Rendering:", url, "...");
      await entry.render({ req, url, head: viteHead });
    } catch (error) {
      const parsedError =
        error instanceof Error
          ? error
          : new Error(
              String(error) !== "[object Object]"
                ? String(error)
                : "Unknown Error",
              { cause: error }
            );
      if (!isProd) {
        vite.ssrFixStacktrace(parsedError);
      }
      console.info(parsedError.stack);
      res.status(500).end(parsedError.stack);
    }
  });
}
