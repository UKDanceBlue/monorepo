import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

/**
 * Remove unique constraint on Configuration.key
 */

export async function up({
  context: { queryInterface },
}: MigrationParams<MigrationContext>) {
  await queryInterface.removeConstraint(
    "configurations",
    "configurations_key_unique"
  );
}
