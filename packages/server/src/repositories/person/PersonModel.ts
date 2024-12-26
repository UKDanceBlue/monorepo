import { PersonNode } from "@ukdanceblue/common";

import { buildDefaultDatabaseModel } from "#repositories/DefaultRepository.js";
import { type membership, person } from "#schema/tables/person.sql.js";
import type { committee, team } from "#schema/tables/team.sql.js";

export class PersonModel<
  Complete extends boolean = boolean,
> extends buildDefaultDatabaseModel(person, PersonNode) {
  constructor(
    public readonly row: Complete extends true
      ? typeof person.$inferSelect & {
          memberships: (typeof membership.$inferSelect & {
            team: typeof team.$inferSelect & {
              correspondingCommittee: null | typeof committee.$inferSelect;
            };
          })[];
        }
      : typeof person.$inferSelect
  ) {
    super(row);
  }

  protected rowToInitParams(
    row: typeof person.$inferSelect
  ): Parameters<typeof PersonNode.init> {
    return [
      {
        id: row.uuid,
        email: row.email,
        createdAt: row.createdAt,
        linkblue: row.linkblue,
        name: row.name,
        updatedAt: row.updatedAt,
      },
    ];
  }
}
