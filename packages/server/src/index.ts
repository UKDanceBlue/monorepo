import "reflect-metadata";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

const { logDir, loggingLevel } = await import("#environment");

const { logger } = await import("#logging/logger.js");

logger.info(
  `Logger initialized with level "${loggingLevel}", writing log files to "${logDir}"`
);

await import("./instrument.js");

await import("./prisma.js");

const { createServer, startHttpServer, startServer } = await import(
  "./server.js"
);
const { app, httpServer, apolloServer } = await createServer();
logger.info("Created server");

const { koaToken } = await import("#routes/koaToken.js");
const { Container } = await import("@freshgum/typedi");
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
