import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  primaryKey,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { image } from "#schema/tables/file.sql.js";
import { pointOpportunity } from "#schema/tables/points.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const event = danceblue.table(
  "Event",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    title: text().notNull(),
    summary: text(),
    description: text(),
    location: text(),
    remoteId: text(),
  },
  (table) => [
    uniqueIndex("Event_remoteId_key").using(
      "btree",
      table.remoteId.asc().nullsLast().op("text_ops")
    ),
    index("Event_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),
  ]
);

export const eventOccurrence = danceblue.table(
  "EventOccurrence",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    fullDay: boolean().default(false).notNull(),
    date: timestamp({
      precision: 6,
      withTimezone: true,
    }).notNull(),
    endDate: timestamp({
      precision: 6,
      withTimezone: true,
    }).notNull(),
    eventId: integer().notNull(),
  },
  (table) => [
    index("EventOccurrence_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.eventId],
      foreignColumns: [event.id],
      name: "EventOccurrence_eventId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);
export const eventImage = danceblue.table(
  "EventImage",
  {
    ...timestamps,
    eventId: integer().notNull(),
    imageId: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [event.id],
      name: "EventImage_eventId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.imageId],
      foreignColumns: [image.id],
      name: "EventImage_imageId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({
      columns: [table.eventId, table.imageId],
      name: "EventImage_pkey",
    }),
  ]
);
export const eventOccurrenceRelations = relations(
  eventOccurrence,
  ({ one }) => ({
    event: one(event, {
      fields: [eventOccurrence.eventId],
      references: [event.id],
    }),
  })
);

export const eventRelations = relations(event, ({ many }) => ({
  eventOccurrences: many(eventOccurrence),
  pointOpportunitys: many(pointOpportunity),
  eventImages: many(eventImage),
}));
export const eventImageRelations = relations(eventImage, ({ one }) => ({
  event: one(event, {
    fields: [eventImage.eventId],
    references: [event.id],
  }),
  image: one(image, {
    fields: [eventImage.imageId],
    references: [image.id],
  }),
}));
