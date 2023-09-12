import { argv } from "node:process";

import type { SyncOptions } from "@sequelize/core";

import { sequelizeDb } from "../data-source.js";
import { logDebug, sqlLogger } from "../logger.js"; // Importing this module will import all the models in the models folder
// and initialize them and their relations.

logDebug("Initializing models");

import "./Configuration.js";
import "./Device.js";
import "./Event.js";
import "./Image.js";
import "./LoginFlowSession.js";
import "./EventOccurrence.js";
import "./Person.js";
import "./PointEntry.js";
import "./Team.js";

logDebug("Initialized models");

logDebug("Initializing model relations");

import "./EventImages.js";
import "./TeamPointEntries.js";
import "./PointEntryPersonFrom.js";
import "./EventOccurrences.js";

logDebug("Initialized model relations");

logDebug("Syncing models");

const syncOptions: SyncOptions = {
  // Force if passed --reset-db flag
  force: argv.includes("--reset-db"),
  logging: (sql: string, timing?: number | undefined) =>
    sqlLogger.log("sql", sql, { timing }),
};

await sequelizeDb.sync(syncOptions);

logDebug("Syncing models");
