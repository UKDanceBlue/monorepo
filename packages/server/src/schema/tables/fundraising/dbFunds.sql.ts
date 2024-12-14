import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  numeric,
  serial,
  text,
  unique,
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
    dbFundsTeamId: integer()
      .notNull()
      .references(() => dbFundsTeam.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    uuid: uuidField(),
    fundraisingEntryId: integer()
      .notNull()
      .unique()
      .references(() => fundraisingEntry.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    createdAt: timestamps().createdAt,
  },
  (table) => [
    unique().on(
      table.donatedTo,
      table.donatedBy,
      table.date,
      table.dbFundsTeamId
    ),
  ]
);

export const dbFundsTeam = danceblue.table(
  "DBFundsTeam",
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    totalAmount: doublePrecision().notNull(),
    active: boolean().notNull(),
    marathonId: integer().references(() => marathon.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
    uuid: uuidField(),
    solicitationCodeId: integer()
      .notNull()
      .references(() => solicitationCode.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      }),
    createdAt: timestamps().createdAt,
  },
  (table) => [unique().on(table.solicitationCodeId, table.marathonId)]
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
  dbFundsFundraisingEntries: many(dbFundsFundraisingEntry),
  marathon: one(marathon, {
    fields: [dbFundsTeam.marathonId],
    references: [marathon.id],
  }),
  solicitationCode: one(solicitationCode, {
    fields: [dbFundsTeam.solicitationCodeId],
    references: [solicitationCode.id],
  }),
}));
