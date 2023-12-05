import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

/**
 * Add viceCommittee to enum_people_committee_name
 */

export async function up({
  context: { queryInterface },
}: MigrationParams<MigrationContext>) {
  await queryInterface.sequelize.query(
    `ALTER TYPE danceblue.enum_people_committee_name ADD VALUE 'viceCommittee'`
  );
}

export function down() {
  throw new Error(
    "This migration cannot be undone - Postgres does not support removing enum values"
  );
}
