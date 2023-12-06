import { argv } from "node:process";

import type { SyncOptions } from "@sequelize/core";

import { sequelizeDb } from "../data-source.js";
import { isDatabaseLocal, isDevelopment } from "../environment.js";
import { logger, sqlLogger } from "../logger.js";

// Importing this module will import all the models in the models folder and initialize them and their relations.

logger.debug("Initializing models");
await import("./Configuration.js");
await import("./Device.js");
await import("./Event.js");
await import("./Image.js");
await import("./LoginFlowSession.js");
await import("./EventOccurrence.js");
await import("./Person.js");
await import("./PointEntry.js");
await import("./PointOpportunity.js");
await import("./Membership.js");
await import("./Team.js");
logger.debug("Initialized models");

logger.debug("Initializing model relations");
await import("./EventImages.js");
await import("./TeamPointEntries.js");
await import("./Memberships.js");
await import("./PointEntryPersonFrom.js");
await import("./PointOpportunityEvents.js");
await import("./PointOpportunityEntries.js");
await import("./EventOccurrences.js");
logger.debug("Initialized model relations");

logger.debug("Initializing model default scopes");
await import("./defaultScopes.js");
logger.debug("Initialized model default scopes");

if (isDatabaseLocal && argv.includes("--seed-db")) {
  logger.info("Syncing models");
  const syncOptions: SyncOptions = {
    // Force if passed --reset-db flag
    logging:
      isDevelopment &&
      ((sql: string, timing?: number | undefined) =>
        sqlLogger.log("sql", sql, { timing })),
  };
  await sequelizeDb.sync(syncOptions);
  logger.info("Models synced");
}
