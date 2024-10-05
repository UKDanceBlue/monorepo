import { logger } from "#logging/logger.js";
import { koaToken } from "#routes/koaToken.js";
import { Container } from "@freshgum/typedi";

import "reflect-metadata";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

logger.info("DanceBlue Server Starting");

await import("./instrument.js");

await import("#environment");

await import("./prisma.js");

const { createServer, startHttpServer, startServer } = await import(
  "./server.js"
);
const { app, httpServer, apolloServer } = await createServer();
logger.info("Created server");
Container.setValue(koaToken, app);

await startHttpServer(httpServer);
const httpServerAddress = httpServer.address();
let httpServerUrl = "";
if (typeof httpServerAddress === "string") {
  httpServerUrl = httpServerAddress;
} else if (httpServerAddress) {
  httpServerUrl =
    httpServerAddress.address === "::" || httpServerAddress.address === ""
      ? `http://localhost:${httpServerAddress.port}`
      : `http://${httpServerAddress.address}:${httpServerAddress.port}`;
}
logger.info(`HTTP server started at ${httpServerUrl}`);

await startServer(apolloServer, app);
logger.info("API started");

logger.info("DanceBlue Server Started");

// Start any manual cron jobs
await import("#jobs/index.js");
