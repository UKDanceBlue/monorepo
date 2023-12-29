import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

/**
 * Add DemoTeam to enum_teams_legacy_status
 */

export async function up({
  context: { queryInterface },
}: MigrationParams<MigrationContext>) {
  const [teamLegacyStatusValues] = await queryInterface.sequelize.query(
    "SELECT unnest(enum_range(NULL::enum_teams_legacy_status))"
  );
  if (
    !teamLegacyStatusValues
      .map((v) => (v as { unnest: string }).unnest)
      .includes("DemoTeam")
  ) {
    await queryInterface.sequelize.query(
      `ALTER TYPE enum_teams_legacy_status ADD VALUE 'DemoTeam'`
    );
  }
}
