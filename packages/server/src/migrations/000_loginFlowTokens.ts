import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

export async function up({
  context: { queryInterface, DataTypes },
}: MigrationParams<MigrationContext>) {
  await queryInterface.addColumn("login_flow_sessions", "set_cookie", {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });
  await queryInterface.addColumn("login_flow_sessions", "send_token", {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });
}

export async function down({
  context: { queryInterface },
}: MigrationParams<MigrationContext>) {
  await queryInterface.removeColumn("login_flow_sessions", "set_cookie");
  await queryInterface.removeColumn("login_flow_sessions", "send_token");
}
