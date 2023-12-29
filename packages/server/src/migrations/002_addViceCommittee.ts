import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

/**
 * Add viceCommittee to enum_people_committee_name
 */

export async function up({
  context: { queryInterface },
}: MigrationParams<MigrationContext>) {
  const [committeeNameValues] = await queryInterface.sequelize.query(
    "SELECT unnest(enum_range(NULL::enum_people_committee_name))"
  );

  if (
    !committeeNameValues
      .map((v) => (v as { unnest: string }).unnest)
      .includes("viceCommittee")
  ) {
    await queryInterface.sequelize.query(
      `ALTER TYPE danceblue.enum_people_committee_name ADD VALUE 'viceCommittee'`
    );
  }
}
