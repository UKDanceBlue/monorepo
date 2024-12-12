import { relations } from "drizzle-orm";
import { foreignKey, index, integer, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { notificationDelivery } from "#schema/tables/notification.sql.js";
import { person } from "#schema/tables/person.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const device = danceblue.table(
  "Device",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    expoPushToken: text(),
    lastSeen: timestamp({ precision: 6, withTimezone: true }),
    lastSeenPersonId: integer(),
    verifier: text(),
  },
  (table) => [
    index("Device_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.lastSeenPersonId],
      foreignColumns: [person.id],
      name: "Device_lastSeenPersonId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);
export const deviceRelations = relations(device, ({ one, many }) => ({
  person: one(person, {
    fields: [device.lastSeenPersonId],
    references: [person.id],
  }),
  notificationDeliverys: many(notificationDelivery),
}));
