import { relations } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { integer, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import {
  committeeName,
  teamLegacyStatus,
  teamType,
} from "#schema/enums.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { solicitationCode } from "#schema/tables/fundraising/entry.sql.js";
import { marathon } from "#schema/tables/marathon.sql.js";
import { membership } from "#schema/tables/person.sql.js";
import { pointEntry } from "#schema/tables/points.sql.js";

export const committee = danceblue.table("Committee", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  identifier: committeeName().notNull().unique(),
  parentCommitteeId: integer().references((): AnyPgColumn => committee.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  ...timestamps(),
});

export const team = danceblue.table("Team", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  name: text().notNull(),
  type: teamType().notNull(),
  legacyStatus: teamLegacyStatus().notNull(),
  persistentIdentifier: text().unique(),
  marathonId: integer()
    .notNull()
    .references(() => marathon.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  correspondingCommitteeId: integer()
    .unique()
    .references(() => committee.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
  dbFundsTeamId: integer(),
  solicitationCodeId: integer().references(() => solicitationCode.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const teamRelations = relations(team, ({ one, many }) => ({
  memberships: many(membership),
  pointEntries: many(pointEntry),
  committee: one(committee, {
    fields: [team.correspondingCommitteeId],
    references: [committee.id],
  }),
  marathon: one(marathon, {
    fields: [team.marathonId],
    references: [marathon.id],
  }),
  solicitationCode: one(solicitationCode, {
    fields: [team.solicitationCodeId],
    references: [solicitationCode.id],
  }),
}));

export const committeeRelations = relations(committee, ({ one, many }) => ({
  committee: one(committee, {
    fields: [committee.parentCommitteeId],
    references: [committee.id],
    relationName: "committee_parentCommitteeId_committee_id",
  }),
  committees: many(committee, {
    relationName: "committee_parentCommitteeId_committee_id",
  }),
  teams: many(team),
}));
