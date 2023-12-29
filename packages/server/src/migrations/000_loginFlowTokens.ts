import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

export async function up({
  context: { queryInterface, DataTypes },
}: MigrationParams<MigrationContext>) {
  await queryInterface.addColumn(
    "login_flow_sessions",
    "set_cookie",
    {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    { ifNotExists: true }
  );
  await queryInterface.addColumn(
    "login_flow_sessions",
    "send_token",
    {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    { ifNotExists: true }
  );
}
