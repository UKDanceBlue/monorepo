import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  foreignKey,
  integer,
  numeric,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import {
  fundraisingEntry,
  solicitationCode,
} from "#schema/tables/fundraising/entry.sql.js";
import { marathon } from "#schema/tables/marathon.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const dbFundsFundraisingEntry = danceblue.table(
  "DBFundsFundraisingEntry",
  {
    id: serial().primaryKey().notNull(),
    amount: numeric({ precision: 65, scale: 30 }).notNull(),
    donatedBy: text(),
    donatedTo: text(),
    date: timestamp({ precision: 3, withTimezone: false }).notNull(),
    dbFundsTeamId: integer().notNull(),
    uuid: uuidField,
    fundraisingEntryId: integer().notNull(),
    createdAt: timestamps.createdAt,
  },
  (table) => [
    uniqueIndex(
      "DBFundsFundraisingEntry_donatedTo_donatedBy_date_dbFundsTea_key"
    ).using(
      "btree",
      table.donatedTo.asc().nullsLast().op("timestamp_ops"),
      table.donatedBy.asc().nullsLast().op("timestamp_ops"),
      table.date.asc().nullsLast().op("int4_ops"),
      table.dbFundsTeamId.asc().nullsLast().op("text_ops")
    ),
    uniqueIndex("DBFundsFundraisingEntry_fundraisingEntryId_key").using(
      "btree",
      table.fundraisingEntryId.asc().nullsLast().op("int4_ops")
    ),

    foreignKey({
      columns: [table.dbFundsTeamId],
      foreignColumns: [dbFundsTeam.id],
      name: "DBFundsFundraisingEntry_dbFundsTeamId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.fundraisingEntryId],
      foreignColumns: [fundraisingEntry.id],
      name: "DBFundsFundraisingEntry_fundraisingEntry",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const dbFundsTeam = danceblue.table(
  "DBFundsTeam",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    totalAmount: doublePrecision().notNull(),
    active: boolean().notNull(),
    marathonId: integer(),
    uuid: uuidField,
    solicitationCodeId: integer().notNull(),
    createdAt: timestamps.createdAt,
  },
  (table) => [
    uniqueIndex("DBFundsTeam_solicitationCodeId_marathonId_key").using(
      "btree",
      table.solicitationCodeId.asc().nullsLast().op("int4_ops"),
      table.marathonId.asc().nullsLast().op("int4_ops")
    ),

    foreignKey({
      columns: [table.marathonId],
      foreignColumns: [marathon.id],
      name: "DBFundsTeam_marathonId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.solicitationCodeId],
      foreignColumns: [solicitationCode.id],
      name: "DBFundsTeam_solicitationCodeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ]
);
export const dbFundsFundraisingEntryRelations = relations(
  dbFundsFundraisingEntry,
  ({ one }) => ({
    dbFundsTeam: one(dbFundsTeam, {
      fields: [dbFundsFundraisingEntry.dbFundsTeamId],
      references: [dbFundsTeam.id],
    }),
    fundraisingEntry: one(fundraisingEntry, {
      fields: [dbFundsFundraisingEntry.fundraisingEntryId],
      references: [fundraisingEntry.id],
    }),
  })
);

export const dbFundsTeamRelations = relations(dbFundsTeam, ({ one, many }) => ({
  dbFundsFundraisingEntrys: many(dbFundsFundraisingEntry),
  marathon: one(marathon, {
    fields: [dbFundsTeam.marathonId],
    references: [marathon.id],
  }),
  solicitationCode: one(solicitationCode, {
    fields: [dbFundsTeam.solicitationCodeId],
    references: [solicitationCode.id],
  }),
}));
