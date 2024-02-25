import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { DataTypes } from "@sequelize/core";
import type { RunnableMigration } from "umzug";

import { logger } from "./lib/logging/logger.js";
import type { MigrationContext } from "./migrations/migrationContext.js";
const { sequelizeDb } = await import("./data-source.js");
const { Umzug, SequelizeStorage } = await import("umzug");

const require = createRequire(import.meta.url);

const umzugContext: MigrationContext = {
  sequelizeDb,
  DataTypes,
  queryInterface: sequelizeDb.getQueryInterface(),
};

export default async function doMigration(skip = false) {
  const migrator = new Umzug({
    migrations: {
      glob: [
        "migrations/*.{js,cjs,mjs}",
        {
          cwd: path.dirname(fileURLToPath(import.meta.url)),
          ignore: ["**/migrationContext.js"],
        },
      ],
      resolve: (params) => {
        if (!params.path) {
          throw new Error("Migration path is required");
        }

        if (params.path.endsWith(".mjs") || params.path.endsWith(".js")) {
          const getModule = () =>
            params.path
              ? (import(pathToFileURL(params.path).href) as Promise<
                  RunnableMigration<unknown>
                >)
              : undefined;
          return {
            name: params.name,
            path: params.path,
            up: async (upParams) => {
              const module = await getModule();
              if (!module) {
                throw new Error(
                  `Could not load migration module for ${params.path}`
                );
              }
              if (skip) {
                logger.debug(`Skipping migration ${params.name}`);
                return;
              } else {
                return module.up(upParams);
              }
            },
            down: async (downParams) => {
              const module = await getModule();
              if (!module) {
                throw new Error(
                  `Could not load migration module for ${params.path}`
                );
              }
              if (!module.down) {
                throw new Error(
                  `Could not access 'down' function for ${params.path}`
                );
              }
              if (skip) {
                logger.debug(`Skipping reverting migration ${params.name}`);
                return;
              } else {
                return module.down(downParams);
              }
            },
          };
        }
        return {
          ...(require(params.path) as RunnableMigration<unknown>),
          name: params.name,
          path: params.path,
        };
      },
    },
    context: umzugContext,
    storage: new SequelizeStorage({
      sequelize: sequelizeDb,
      columnType: DataTypes.STRING,
      schema: "danceblue",
    }),
    logger: {
      debug(message) {
        try {
          logger.debug(JSON.stringify(message));
        } catch (error) {
          console.error(error);
        }
      },
      info(message) {
        try {
          logger.info(JSON.stringify(message));
        } catch (error) {
          console.error(error);
        }
      },
      warn(message) {
        try {
          logger.warning(JSON.stringify(message));
        } catch (error) {
          console.error(error);
        }
      },
      error(message) {
        try {
          logger.error(JSON.stringify(message));
        } catch (error) {
          console.error(error);
        }
      },
    },
  });

  await migrator.up();
}
