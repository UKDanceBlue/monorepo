import { Service } from "@freshgum/typedi";
import express from "express";
import { readFile } from "fs/promises";
import { dirname, extname, resolve } from "path";
import { fileURLToPath } from "url";
import type { ViteDevServer } from "vite";

import { logger } from "#lib/logging/standardLogging.js";
import { isDevelopmentToken } from "#lib/typediTokens.js";

import { ExpressModule } from "./Express.js";

type RenderFunction = (options: {
  req: express.Request;
  res: express.Response;
  head: string;
}) => Promise<void>;

@Service(
  {
    scope: "singleton",
  },
  [ExpressModule, isDevelopmentToken]
)
export class PortalModule {
  private readonly hmrPort = 3000;
  constructor(
    private readonly expressModule: ExpressModule,
    private readonly isDevelopment: boolean
  ) {}

  async startSpa() {
    logger.debug("Mounting static portal");

    let portalIndex: string | undefined;
    try {
      portalIndex = await readFile(
        resolve(
          fileURLToPath(import.meta.resolve("@ukdanceblue/portal/index.html"))
        ),
        "utf8"
      );
    } catch (error) {
      portalIndex = undefined;
    }

    if (portalIndex) {
      // This route is used to close the portal popup window after authentication
      this.expressModule.app.all("/_close", (_req, res) => {
        return void res
          .type("html")
          .status(200)
          .send(
            "<html><body><script>window.close();</script><noscript>You may close this window</noscript></body></html>"
          );
      });

      this.expressModule.app.use(
        "/assets",
        express.static(
          resolve(
            fileURLToPath(import.meta.resolve("@ukdanceblue/portal/assets"))
          ),
          {}
        )
      );

      this.expressModule.app.get("*", (_req, res) => {
        res.type("html");
        res.send(portalIndex);
      });
    } else {
      (this.isDevelopment ? logger.info : logger.error)(
        "Portal index.html could not be loaded"
      );
    }
  }

  async startSsr() {
    logger.debug("Mounting Portal");
    let vite: ViteDevServer | undefined = undefined;
    if (this.isDevelopment) {
      vite = await this.initializeViteServer();
      logger.info("Vite dev server initialized");
    }

    const entryPoint = await this.getSsrEntryPoint(vite);

    // This route is used to close the portal popup window after authentication
    this.expressModule.app.all("/_close", (_req, res) => {
      return void res
        .type("html")
        .status(200)
        .send(
          "<html><body><script>window.close();</script><noscript>You may close this window</noscript></body></html>"
        );
    });

    this.expressModule.app.use("*", async (req, res, next) => {
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
        let viteHead = this.isDevelopment
          ? `<html><head></head><body></body></html>`
          : "";

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

  private async initializeViteServer() {
    const { createServer } = await import("vite");
    const root = dirname(
      dirname(
        fileURLToPath(import.meta.resolve("@ukdanceblue/portal/src/main.tsx"))
      )
    );

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
          port: this.hmrPort,
        },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    this.expressModule.app.use(vite.middlewares);
    return vite;
  }

  private async getSsrEntryPoint(
    vite: ViteDevServer | undefined
  ): Promise<{ render: RenderFunction }> {
    if (!vite) {
      logger.debug("Importing pre-built SSR entry point");
      return import(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "@ukdanceblue/portal/server/ssr/entry-server.js"
      ) as Promise<{
        render: RenderFunction;
      }>;
    } else {
      logger.debug("Loading SSR entry point from Vite");
      const entry = await vite.ssrLoadModule(
        "@ukdanceblue/portal/src/ssr/entry-server.tsx"
      );
      return entry as { render: RenderFunction };
    }
  }
}
