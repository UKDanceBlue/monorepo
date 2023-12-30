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
  await queryInterface.addColumn(
    "configurations",
    "value",
    {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    { ifNotExists: true }
  );

  await queryInterface.addColumn(
    "configurations",
    "valid_after",
    {
      type: DataTypes.DATE,
      allowNull: true,
    },
    { ifNotExists: true }
  );

  await queryInterface.addColumn(
    "configurations",
    "valid_until",
    {
      type: DataTypes.DATE,
      allowNull: true,
    },
    { ifNotExists: true }
  );

  await queryInterface.addColumn(
    "configurations",
    "created_at",
    {
      type: DataTypes.DATE,
      allowNull: false,
    },
    { ifNotExists: true }
  );

  await queryInterface.addColumn(
    "configurations",
    "updated_at",
    {
      type: DataTypes.DATE,
      allowNull: false,
    },
    { ifNotExists: true }
  );
}
