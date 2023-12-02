import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

export async function up({
  context: { queryInterface, DataTypes },
}: MigrationParams<MigrationContext>) {
  await queryInterface.addColumn("login_flow_sessions", "setCookie", {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });
  await queryInterface.addColumn("login_flow_sessions", "sendToken", {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });
}
