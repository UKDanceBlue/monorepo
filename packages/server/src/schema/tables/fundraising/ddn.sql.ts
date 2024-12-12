import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  foreignKey,
  index,
  integer,
  numeric,
  primaryKey,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";

import { fundraisingEntry, solicitationCode } from "./entry.sql.js";

export const dailyDepartmentNotificationBatch = danceblue.table(
  "DailyDepartmentNotificationBatch",
  {
    batchId: text().notNull(),
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
  },
  (table) => [
    uniqueIndex("DailyDepartmentNotificationBatch_batchId_key").using(
      "btree",
      table.batchId.asc().nullsLast().op("text_ops")
    ),
    index("DailyDepartmentNotificationBatch_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),
  ]
);
export const ddnDonor = danceblue.table(
  "DDNDonor",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    donorId: text().notNull(),
    giftKey: text(),
    name: text(),
    deceased: boolean().notNull(),
    constituency: text(),
    titleBar: text(),
    pm: text(),
    degrees: text().array(),
    emails: text().array(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("DDNDonor_donorId_key").using(
      "btree",
      table.donorId.asc().nullsLast().op("text_ops")
    ),
    index("DDNDonor_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),
  ]
);

export const dailyDepartmentNotification = danceblue.table(
  "DailyDepartmentNotification",
  {
    division: text(),
    department: text(),
    effectiveDate: date(),
    processDate: date().notNull(),
    pledgedDate: date(),
    transactionDate: date(),
    transactionType: text().notNull(),
    combinedAmount: numeric({ precision: 65, scale: 30 }).notNull(),
    pledgedAmount: numeric({ precision: 65, scale: 30 }).notNull(),
    accountNumber: text().notNull(),
    accountName: text().notNull(),
    holdingDestination: text(),
    comment: text(),
    secShares: text(),
    secType: text(),
    gikType: text(),
    gikDescription: text(),
    onlineGift: boolean().notNull(),
    solicitation: text(),
    behalfHonorMemorial: text(),
    matchingGift: text(),
    ukFirstGift: boolean().notNull(),
    divFirstGift: boolean().notNull(),
    idSorter: text().notNull(),
    combinedDonorName: text().notNull(),
    combinedDonorSalutation: text().notNull(),
    combinedDonorSort: text(),
    transmittalSn: text(),
    sapDocNum: text(),
    sapDocDate: date(),
    jvDocNum: text(),
    jvDocDate: date(),
    advFeeCcPhil: text(),
    advFeeAmtPhil: numeric({ precision: 65, scale: 30 }),
    advFeeCcUnit: text(),
    advFeeAmtUnit: numeric({ precision: 65, scale: 30 }),
    advFeeStatus: text(),
    hcUnit: text(),
    id: serial().primaryKey().notNull(),
    solicitationCodeId: integer().notNull(),
    fundraisingEntryId: integer().notNull(),
    uuid: uuidField,
    batchId: integer().notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("DailyDepartmentNotification_fundraisingEntryId_key").using(
      "btree",
      table.fundraisingEntryId.asc().nullsLast().op("int4_ops")
    ),
    uniqueIndex(
      "DailyDepartmentNotification_idSorter_processDate_batchId_so_key"
    ).using(
      "btree",
      table.idSorter.asc().nullsLast().op("int4_ops"),
      table.processDate.asc().nullsLast().op("int4_ops"),
      table.batchId.asc().nullsLast().op("numeric_ops"),
      table.solicitationCodeId.asc().nullsLast().op("text_ops"),
      table.combinedAmount.asc().nullsLast().op("text_ops")
    ),
    index("DailyDepartmentNotification_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.solicitationCodeId],
      foreignColumns: [solicitationCode.id],
      name: "DailyDepartmentNotification_solicitationCodeId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.fundraisingEntryId],
      foreignColumns: [fundraisingEntry.id],
      name: "DailyDepartmentNotification_fundraisingEntry",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.batchId],
      foreignColumns: [dailyDepartmentNotificationBatch.id],
      name: "DailyDepartmentNotification_batchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);
export const ddnDonorLink = danceblue.table(
  "DDNDonorLink",
  {
    donorId: integer().notNull(),
    ddnId: integer().notNull(),
    amount: numeric({ precision: 65, scale: 30 }).notNull(),
    relation: text(),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.donorId],
      foreignColumns: [ddnDonor.id],
      name: "DDNDonorLink_donorId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.ddnId],
      foreignColumns: [dailyDepartmentNotification.id],
      name: "DDNDonorLink_ddnId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    primaryKey({
      columns: [table.donorId, table.ddnId],
      name: "DDNDonorLink_pkey",
    }),
  ]
);

export const dailyDepartmentNotificationRelations = relations(
  dailyDepartmentNotification,
  ({ one, many }) => ({
    solicitationCode: one(solicitationCode, {
      fields: [dailyDepartmentNotification.solicitationCodeId],
      references: [solicitationCode.id],
    }),
    fundraisingEntry: one(fundraisingEntry, {
      fields: [dailyDepartmentNotification.fundraisingEntryId],
      references: [fundraisingEntry.id],
    }),
    dailyDepartmentNotificationBatch: one(dailyDepartmentNotificationBatch, {
      fields: [dailyDepartmentNotification.batchId],
      references: [dailyDepartmentNotificationBatch.id],
    }),
    ddnDonorLinks: many(ddnDonorLink),
  })
);

export const dailyDepartmentNotificationBatchRelations = relations(
  dailyDepartmentNotificationBatch,
  ({ many }) => ({
    dailyDepartmentNotifications: many(dailyDepartmentNotification),
  })
);
export const ddnDonorLinkRelations = relations(ddnDonorLink, ({ one }) => ({
  ddnDonor: one(ddnDonor, {
    fields: [ddnDonorLink.donorId],
    references: [ddnDonor.id],
  }),
  dailyDepartmentNotification: one(dailyDepartmentNotification, {
    fields: [ddnDonorLink.ddnId],
    references: [dailyDepartmentNotification.id],
  }),
}));

export const ddnDonorRelations = relations(ddnDonor, ({ many }) => ({
  ddnDonorLinks: many(ddnDonorLink),
}));
