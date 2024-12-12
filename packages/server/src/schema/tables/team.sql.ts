import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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

export const committee = danceblue.table(
  "Committee",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    identifier: committeeName().notNull(),
    parentCommitteeId: integer(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("Committee_identifier_key").using(
      "btree",
      table.identifier.asc().nullsLast().op("enum_ops")
    ),
    index("Committee_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.parentCommitteeId],
      foreignColumns: [table.id],
      name: "Committee_parentCommitteeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);
export const team = danceblue.table(
  "Team",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    name: text().notNull(),
    type: teamType().notNull(),
    legacyStatus: teamLegacyStatus().notNull(),
    persistentIdentifier: text(),
    marathonId: integer().notNull(),
    correspondingCommitteeId: integer(),
    dbFundsTeamId: integer(),
    solicitationCodeId: integer(),
  },
  (table) => [
    uniqueIndex("Team_marathonId_correspondingCommitteeId_key").using(
      "btree",
      table.marathonId.asc().nullsLast().op("int4_ops"),
      table.correspondingCommitteeId.asc().nullsLast().op("int4_ops")
    ),
    uniqueIndex("Team_marathonId_persistentIdentifier_key").using(
      "btree",
      table.marathonId.asc().nullsLast().op("text_ops"),
      table.persistentIdentifier.asc().nullsLast().op("int4_ops")
    ),
    index("Team_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.correspondingCommitteeId],
      foreignColumns: [committee.id],
      name: "Team_correspondingCommitteeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.marathonId],
      foreignColumns: [marathon.id],
      name: "Team_marathonId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.solicitationCodeId],
      foreignColumns: [solicitationCode.id],
      name: "Team_solicitationCodeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);
export const teamRelations = relations(team, ({ one, many }) => ({
  memberships: many(membership),
  pointEntrys: many(pointEntry),
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
