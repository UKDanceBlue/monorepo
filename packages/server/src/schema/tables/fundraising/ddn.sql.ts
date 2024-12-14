import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  numeric,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";

import { fundraisingEntry, solicitationCode } from "./entry.sql.js";

export const dailyDepartmentNotificationBatch = danceblue.table(
  "DailyDepartmentNotificationBatch",
  {
    batchId: text().notNull().unique(),
    id: serial().primaryKey().notNull(),
    uuid: uuidField(),
    ...timestamps(),
  }
);
export const ddnDonor = danceblue.table("DDNDonor", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  donorId: text().notNull().unique(),
  giftKey: text(),
  name: text(),
  deceased: boolean().notNull(),
  constituency: text(),
  titleBar: text(),
  pm: text(),
  degrees: text().array(),
  emails: text().array(),
  ...timestamps(),
});

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
    solicitationCodeId: integer()
      .notNull()
      .references(() => solicitationCode.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      }),
    fundraisingEntryId: integer()
      .notNull()
      .unique()
      .references(() => fundraisingEntry.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    uuid: uuidField(),
    batchId: integer()
      .notNull()
      .references(() => dailyDepartmentNotificationBatch.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    ...timestamps(),
  }
);

export const ddnDonorLink = danceblue.table(
  "DDNDonorLink",
  {
    donorId: integer()
      .notNull()
      .references(() => ddnDonor.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      }),
    ddnId: integer()
      .notNull()
      .references(() => dailyDepartmentNotification.id, {
        onUpdate: "cascade",
        onDelete: "restrict",
      }),
    amount: numeric({ precision: 65, scale: 30 }).notNull(),
    relation: text(),
    ...timestamps(),
  },
  (table) => [
    primaryKey({
      columns: [table.donorId, table.ddnId],
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
