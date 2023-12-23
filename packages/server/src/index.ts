import { argv } from "node:process";

import { QueryTypes } from "@sequelize/core";

import { sequelizeDb } from "./data-source.js";
import { isDatabaseLocal } from "./environment.js";
import { logFatal, logger } from "./logger.js";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

logger.info("DanceBlue Server Starting");

await import("./environment.js");
logger.info("Loaded environment variables");

await import("./models/init.js");
logger.info("Initialized database models");

if (argv.includes("--migrate-db")) {
  const { default: doMigration } = await import("./umzug.js");

  const doesPeopleTableExist = await sequelizeDb.query(
    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'danceblue' AND table_name = 'people')",
    { type: QueryTypes.SELECT }
  );
  console.log(doesPeopleTableExist);
  if ((doesPeopleTableExist[0] as { exists: boolean }).exists) {
    logger.info("Database exists, running migration");
    try {
      await doMigration(false);
      logger.info("Database migrated");
    } catch (error) {
      logFatal(
        `Failed to migrate database: ${
          typeof error === "object" && error && "message" in error
            ? String(error.message)
            : String(error)
        }`
      );
    }
  } else {
    logger.info(
      "Database does not exist, skipping migration and syncing instead"
    );
    await sequelizeDb.sync();
    logger.info("Database synced");
    await doMigration(true);
  }
}

// Seed the database if passed the --seed flag
if (argv.includes("--seed-db") && isDatabaseLocal) {
  logger.info("'--seed-db' flag detected, seeding database");
  const { default: seedDatabase } = await import("./seeders/index.js");
  await seedDatabase();
  logger.info("Database seeded");
}

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
