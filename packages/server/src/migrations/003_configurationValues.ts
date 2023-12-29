/*
Add:

    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    validAfter: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

to `configuration` table.
*/

import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

export async function up({
  context: { queryInterface, DataTypes },
}: MigrationParams<MigrationContext>) {
  const configurationTable =
    await queryInterface.describeTable("configuration");

  if ("value" in configurationTable) {
    return;
  }
  await queryInterface.addColumn("configuration", "value", {
    type: DataTypes.TEXT,
    allowNull: false,
  });

  await queryInterface.addColumn("configuration", "validAfter", {
    type: DataTypes.DATE,
    allowNull: true,
  });

  await queryInterface.addColumn("configuration", "validUntil", {
    type: DataTypes.DATE,
    allowNull: true,
  });

  await queryInterface.addColumn("configuration", "createdAt", {
    type: DataTypes.DATE,
    allowNull: false,
  });

  await queryInterface.addColumn("configuration", "updatedAt", {
    type: DataTypes.DATE,
    allowNull: false,
  });

  await queryInterface.sequelize.query(`
    UPDATE configuration
    SET
      value = '[]',
      validAfter = NULL,
      validUntil = NULL,
      createdAt = NOW(),
      updatedAt = NOW()
  `);
}
