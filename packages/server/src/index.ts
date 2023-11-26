import { argv } from "node:process";

import { isDatabaseLocal } from "./environment.js";
import { logFatal, logInfo } from "./logger.js";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

logInfo("DanceBlue Server Starting");

await import("./environment.js");
logInfo("Loaded environment variables");

if (argv.includes("--migrate-db")) {
  try {
    await import("./umzug.js");
    logInfo("Database migrated");
  } catch (error) {
    logFatal(
      `Failed to migrate database: ${
        typeof error === "object" && error && "message" in error
          ? String(error.message)
          : String(error)
      }`
    );
  }
}

await import("./models/init.js");
logInfo("Initialized database models");

// Seed the database if passed the --seed flag
if (argv.includes("--seed-db") && isDatabaseLocal) {
  logInfo("'--seed-db' flag detected, seeding database");
  const { default: seedDatabase } = await import("./seeders/index.js");
  await seedDatabase();
  logInfo("Database seeded");
}

const { createServer, startHttpServer, startServer } = await import(
  "./server.js"
);
const { app, httpServer, apolloServer } = await createServer();
logInfo("Created server");

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
logInfo(`HTTP server started at ${httpServerUrl}`);

await startServer(apolloServer, app);
logInfo("API started");

logInfo("DanceBlue Server Started");
