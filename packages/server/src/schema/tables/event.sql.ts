import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { image } from "#schema/tables/file.sql.js";
import { pointOpportunity } from "#schema/tables/points.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const event = danceblue.table("Event", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  title: text().notNull(),
  summary: text(),
  description: text(),
  location: text(),
  remoteId: text().unique(),
});

export const eventOccurrence = danceblue.table("EventOccurrence", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  fullDay: boolean().default(false).notNull(),
  date: timestamp({
    precision: 6,
    withTimezone: true,
  }).notNull(),
  endDate: timestamp({
    precision: 6,
    withTimezone: true,
  }).notNull(),
  eventId: integer()
    .notNull()
    .references(() => event.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
});
export const eventImage = danceblue.table(
  "EventImage",
  {
    ...timestamps(),
    eventId: integer()
      .notNull()
      .references(() => event.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    imageId: integer()
      .notNull()
      .references(() => image.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.eventId, table.imageId],
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
  pointOpportunities: many(pointOpportunity),
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
