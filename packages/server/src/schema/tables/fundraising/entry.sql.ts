import { relations } from "drizzle-orm";
import {
  date,
  foreignKey,
  index,
  integer,
  numeric,
  serial,
  text,
  uniqueIndex,
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
    uuid: uuidField,
    ...timestamps,
    amount: numeric({ precision: 65, scale: 30 }).notNull(),
    personId: integer().notNull(),
    fundraisingId: integer().notNull(),
    assignedBy: integer(),
  },
  (table) => [
    uniqueIndex("FundraisingAssignment_fundraisingId_personId_key").using(
      "btree",
      table.fundraisingId.asc().nullsLast().op("int4_ops"),
      table.personId.asc().nullsLast().op("int4_ops")
    ),
    index("FundraisingAssignment_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.assignedBy],
      foreignColumns: [person.id],
      name: "FundraisingAssignment_assignedBy_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.personId],
      foreignColumns: [person.id],
      name: "FundraisingAssignment_personId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.fundraisingId],
      foreignColumns: [fundraisingEntry.id],
      name: "fundraising_assignment_parent_entry",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);
export const solicitationCode = danceblue.table(
  "SolicitationCode",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    prefix: text().notNull(),
    code: integer().notNull(),
    name: text(),
  },
  (table) => [
    uniqueIndex("SolicitationCode_prefix_code_key").using(
      "btree",
      table.prefix.asc().nullsLast().op("int4_ops"),
      table.code.asc().nullsLast().op("int4_ops")
    ),
    index("SolicitationCode_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),
  ]
);
export const fundraisingEntry = danceblue.table(
  "FundraisingEntry",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    notes: text(),
    enteredByPersonId: integer(),
    solicitationCodeId: integer(),
    amountOverride: numeric({ precision: 65, scale: 30 }),
    batchTypeOverride: batchType(),
    donatedByOverride: text(),
    donatedOnOverride: date(),
    donatedToOverride: text(),
  },
  (table) => [
    index("FundraisingEntry_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.enteredByPersonId],
      foreignColumns: [person.id],
      name: "FundraisingEntry_enteredByPersonId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.solicitationCodeId],
      foreignColumns: [solicitationCode.id],
      name: "FundraisingEntry_solicitationCodeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);
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
      fields: [fundraisingEntry.solicitationCodeId],
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
