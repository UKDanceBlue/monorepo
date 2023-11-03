import { argv } from "node:process";

import type { SyncOptions } from "@sequelize/core";

import { sequelizeDb } from "../data-source.js";
import { isDevelopment } from "../environment.js";
import { logDebug, sqlLogger } from "../logger.js";

// Importing this module will import all the models in the models folder and initialize them and their relations.

logDebug("Initializing models");
await import("./Configuration.js");
await import("./Device.js");
await import("./Event.js");
await import("./Image.js");
await import("./LoginFlowSession.js");
await import("./EventOccurrence.js");
await import("./Person.js");
await import("./PointEntry.js");
await import("./Membership.js");
await import("./Team.js");
logDebug("Initialized models");

logDebug("Initializing model relations");
await import("./EventImages.js");
await import("./TeamPointEntries.js");
await import("./Memberships.js");
await import("./PointEntryPersonFrom.js");
await import("./EventOccurrences.js");
logDebug("Initialized model relations");

logDebug("Initializing model default scopes");
await import("./defaultScopes.js");
logDebug("Initialized model default scopes");

logDebug("Syncing models");
const syncOptions: SyncOptions = {
  // Force if passed --reset-db flag
  force: argv.includes("--reset-db"),
  logging:
    isDevelopment &&
    ((sql: string, timing?: number | undefined) =>
      sqlLogger.log("sql", sql, { timing })),
};
await sequelizeDb.sync(syncOptions);
logDebug("Models synced");
