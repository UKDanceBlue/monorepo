import type { DataTypes, Sequelize } from "@sequelize/core";

export type MigrationContext = {
  sequelizeDb: Sequelize;
  DataTypes: typeof DataTypes;
  queryInterface: ReturnType<Sequelize["getQueryInterface"]>;
};
