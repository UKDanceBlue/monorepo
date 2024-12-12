import { relations } from "drizzle-orm";
import { foreignKey, index, integer, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { image } from "#schema/tables/file.sql.js";

export const feedItem = danceblue.table(
  "FeedItem",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    title: text().notNull(),
    textContent: text(),
    imageId: integer(),
  },
  (table) => [
    index("FeedItem_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.imageId],
      foreignColumns: [image.id],
      name: "FeedItem_imageId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);
export const feedItemRelations = relations(feedItem, ({ one }) => ({
  image: one(image, {
    fields: [feedItem.imageId],
    references: [image.id],
  }),
}));
