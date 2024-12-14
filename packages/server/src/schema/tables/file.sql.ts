import { relations } from "drizzle-orm";
import { boolean, integer, serial, text, varchar } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { eventImage } from "#schema/tables/event.sql.js";
import { feedItem } from "#schema/tables/feed.sql.js";
import { marathonHourMapImage } from "#schema/tables/marathon.sql.js";
import { person } from "#schema/tables/person.sql.js";
import { bytea } from "#schema/types.sql.js";

export const image = danceblue.table("Image", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  thumbHash: bytea("thumbHash"),
  alt: text(),
  width: integer().notNull(),
  height: integer().notNull(),
  fileId: integer().references(() => file.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
});

export const file = danceblue.table("File", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  filename: text().notNull(),
  mimeTypeName: varchar({ length: 127 }).notNull(),
  mimeSubtypeName: varchar({ length: 127 }).notNull(),
  mimeParameters: text().array(),
  locationUrl: text().notNull(),
  requiresLogin: boolean().default(false).notNull(),
  ownedBy: integer().references(() => person.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  ...timestamps(),
});
export const imageRelations = relations(image, ({ one, many }) => ({
  file: one(file, {
    fields: [image.fileId],
    references: [file.id],
  }),
  feedItems: many(feedItem),
  marathonHourMapImages: many(marathonHourMapImage),
  eventImages: many(eventImage),
}));

export const fileRelations = relations(file, ({ one, many }) => ({
  images: many(image),
  person: one(person, {
    fields: [file.ownedBy],
    references: [person.id],
  }),
}));
