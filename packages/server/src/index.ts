import { logger } from "./lib/logging/logger.js";

import "reflect-metadata";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

logger.info("DanceBlue Server Starting");

await import("./environment.js");
logger.info("Loaded environment variables");

await import("./prisma.js");

// Start any manual cron jobs
await import("./jobs/index.js");

const { createServer, startHttpServer, startServer } = await import(
  "./server.js"
);
const { app, httpServer, apolloServer } = await createServer();
logger.info("Created server");

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
