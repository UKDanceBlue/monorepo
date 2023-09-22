import { argv } from "node:process";

import dotenv from "dotenv";

import { logInfo } from "./logger.js";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

logInfo("DanceBlue Server Starting");

dotenv.config();
logInfo("Loaded environment variables");

await import("./models/init.js");
logInfo("Initialized database models");

// Seed the database if passed the --seed flag
if (argv.includes("--seed-db")) {
  logInfo("'--seed-db' flag detected, seeding database");
  const { default: seedDatabase } = await import("./seeders/index.js");
  await seedDatabase();
  logInfo("Database seeded");
}

const { createServer, startHttpServer, startServer } = await import(
  "./server.js"
);
const { app, httpServer, apolloServer } = createServer();
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
logInfo("Apollo server started");

logInfo("DanceBlue Server Started");
