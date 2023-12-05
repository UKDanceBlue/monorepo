import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

/**
 * Add DemoTeam to enum_teams_legacy_status
 */

export async function up({
  context: { queryInterface },
}: MigrationParams<MigrationContext>) {
  await queryInterface.sequelize.query(
    `ALTER TYPE enum_teams_legacy_status ADD VALUE 'DemoTeam'`
  );
}

export function down() {
  throw new Error(
    "This migration cannot be undone - Postgres does not support removing enum values"
  );
}
