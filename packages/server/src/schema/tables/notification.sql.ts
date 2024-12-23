import { relations } from "drizzle-orm";
import { integer, serial, text, uuid } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { notificationError } from "#schema/enums.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { device } from "#schema/tables/device.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const notificationDelivery = danceblue.table("NotificationDelivery", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  deviceId: integer()
    .notNull()
    .references(() => device.id, { onUpdate: "cascade", onDelete: "cascade" }),
  notificationId: integer()
    .notNull()
    .references(() => notification.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  receiptId: text().unique(),
  deliveryError: notificationError(),
  ...timestamps(),
  chunkUuid: uuid(),
  receiptCheckedAt: timestamp({
    precision: 6,
    withTimezone: true,
  }),
  sentAt: timestamp({ precision: 6, withTimezone: true }),
});

export const notification = danceblue.table("Notification", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  title: text().notNull(),
  body: text().notNull(),
  url: text(),
  deliveryIssue: text(),
  deliveryIssueAcknowledgedAt: timestamp({
    precision: 6,
    withTimezone: true,
  }),
  sendAt: timestamp({ precision: 6, withTimezone: true }),
  startedSendingAt: timestamp({
    precision: 6,
    withTimezone: true,
  }),
});

export const notificationDeliveryRelations = relations(
  notificationDelivery,
  ({ one }) => ({
    device: one(device, {
      fields: [notificationDelivery.deviceId],
      references: [device.id],
    }),
    notification: one(notification, {
      fields: [notificationDelivery.notificationId],
      references: [notification.id],
    }),
  })
);

export const notificationRelations = relations(notification, ({ many }) => ({
  notificationDeliveries: many(notificationDelivery),
}));
