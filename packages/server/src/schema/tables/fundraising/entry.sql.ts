import { relations } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  serial,
  text,
  unique,
} from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { batchType } from "#schema/enums.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import {
  dbFundsFundraisingEntry,
  dbFundsTeam,
} from "#schema/tables/fundraising/dbFunds.sql.js";
import { dailyDepartmentNotification } from "#schema/tables/fundraising/ddn.sql.js";
import { person } from "#schema/tables/person.sql.js";
import { team } from "#schema/tables/team.sql.js";

export const fundraisingAssignment = danceblue.table(
  "FundraisingAssignment",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField(),
    ...timestamps(),
    amount: numeric({ precision: 65, scale: 2 }).notNull(),
    personId: integer()
      .notNull()
      .references(() => person.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    fundraisingId: integer()
      .notNull()
      .references(() => fundraisingEntry.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    assignedBy: integer().references(() => person.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
  },
  (table) => [unique().on(table.personId, table.fundraisingId)]
);

export const solicitationCode = danceblue.table(
  "SolicitationCode",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField(),
    ...timestamps(),
    prefix: text().notNull(),
    code: integer().notNull(),
    name: text(),
  },
  (table) => [unique().on(table.prefix, table.code)]
);

export const fundraisingEntry = danceblue.table("FundraisingEntry", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  notes: text(),
  enteredByPersonId: integer().references(() => person.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  solicitationCodeOverrideId: integer().references(() => solicitationCode.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  amountOverride: numeric({ precision: 65, scale: 2 }),
  batchTypeOverride: batchType(),
  donatedByOverride: text(),
  donatedOnOverride: date(),
  donatedToOverride: text(),
});

export const fundraisingAssignmentRelations = relations(
  fundraisingAssignment,
  ({ one }) => ({
    person_assignedBy: one(person, {
      fields: [fundraisingAssignment.assignedBy],
      references: [person.id],
      relationName: "fundraisingAssignment_assignedBy_person_id",
    }),
    person_personId: one(person, {
      fields: [fundraisingAssignment.personId],
      references: [person.id],
      relationName: "fundraisingAssignment_personId_person_id",
    }),
    fundraisingEntry: one(fundraisingEntry, {
      fields: [fundraisingAssignment.fundraisingId],
      references: [fundraisingEntry.id],
    }),
  })
);

export const fundraisingEntryRelations = relations(
  fundraisingEntry,
  ({ one, many }) => ({
    fundraisingAssignments: many(fundraisingAssignment),
    dbFundsFundraisingEntrys: many(dbFundsFundraisingEntry),
    dailyDepartmentNotifications: many(dailyDepartmentNotification),
    person: one(person, {
      fields: [fundraisingEntry.enteredByPersonId],
      references: [person.id],
    }),
    solicitationCode: one(solicitationCode, {
      fields: [fundraisingEntry.solicitationCodeOverrideId],
      references: [solicitationCode.id],
    }),
  })
);

export const solicitationCodeRelations = relations(
  solicitationCode,
  ({ many }) => ({
    teams: many(team),
    dbFundsTeams: many(dbFundsTeam),
    dailyDepartmentNotifications: many(dailyDepartmentNotification),
    fundraisingEntrys: many(fundraisingEntry),
  })
);
