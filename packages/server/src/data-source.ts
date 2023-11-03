import type { Options as SequelizeOptions } from "@sequelize/core";
import { Sequelize } from "@sequelize/core";
import dotenv from "dotenv";

dotenv.config();

import {
  databaseHost,
  databaseName,
  databasePassword,
  databasePort,
  databaseUsername,
  isDevelopment,
} from "./environment.js";
import { logError, logFatal, logInfo, sqlLogger } from "./logger.js";

if (isDevelopment) {
  Sequelize.hooks.addListeners({
    beforeInit: (config) => {
      sqlLogger.log("info", "Initializing Sequelize", {
        database: config.database,
        schema: config.schema,
        applicationName: config.dialectOptions?.applicationName as
          | string
          | undefined,
        models: config.models?.map((model) => model.name),
      });
    },
    afterInit: (sequelizeInstance) => {
      sqlLogger.log("info", "Sequelize initialized", {
        database: sequelizeInstance.config.database,
        schema: sequelizeInstance.config.dialectOptions.schema,
        applicationName: sequelizeInstance.config.dialectOptions
          .applicationName as string | undefined,
      });
    },
  });
}

const dbOptions = {
  dialect: "postgres",
  host: databaseHost,
  port: Number.parseInt(databasePort, 10),
  logging:
    isDevelopment &&
    ((sql: string, timing?: number | undefined) =>
      sqlLogger.log("sql", sql, { timing })),
  benchmark: true, // Dev
  define: {
    underscored: true,
    paranoid: true,
    schema: "danceblue",
  },
  dialectOptions: {
    application_name: "db-server",
  },
} satisfies SequelizeOptions;

export const sequelizeDb = new Sequelize(
  databaseName,
  databaseUsername,
  databasePassword,
  dbOptions
);

if (isDevelopment) {
  sequelizeDb.hooks.addListeners({
    beforeConnect: (config) =>
      void sqlLogger.log("info", "Connecting to database", {
        host: config.host,
        port: config.port,
        username: config.username,
        database: config.database,
        schema: config.dialectOptions?.schema,
      }),
    afterConnect: () => void sqlLogger.log("info", "Connected to database"),
    beforeDisconnect: () =>
      void sqlLogger.log("info", "Disconnecting from database"),
    afterDisconnect: () =>
      void sqlLogger.log("info", "Database connection closed"),
  });
}

try {
  await sequelizeDb.authenticate();
  logInfo("Database connection tested successfully.");
} catch (error) {
  logError("Unable to connect to the database:", error);
  logFatal("Shutting down due to database connection failure");
}

await sequelizeDb.createSchema("danceblue");
