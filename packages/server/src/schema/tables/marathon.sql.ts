import { relations } from "drizzle-orm";
import { foreignKey, index, integer, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { image } from "#schema/tables/file.sql.js";
import { dbFundsTeam } from "#schema/tables/fundraising/dbFunds.sql.js";
import { pointOpportunity } from "#schema/tables/points.sql.js";
import { team } from "#schema/tables/team.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const marathonHourMapImage = danceblue.table(
  "MarathonHourMapImage",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField(),
    marathonHourId: integer().notNull(),
    imageId: integer().notNull(),
    ...timestamps(),
  },
  (table) => [
    index("MarathonHourMapImage_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.imageId],
      foreignColumns: [image.id],
      name: "MarathonHourMapImage_imageId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.marathonHourId],
      foreignColumns: [marathonHour.id],
      name: "MarathonHourMapImage_marathonHourId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const marathonHour = danceblue.table(
  "MarathonHour",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField(),
    marathonId: integer().notNull(),
    title: text().notNull(),
    details: text(),
    shownStartingAt: timestamp({
      precision: 6,
      withTimezone: true,
    }).notNull(),
    durationInfo: text().notNull(),
    ...timestamps(),
  },
  (table) => [
    index("MarathonHour_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.marathonId],
      foreignColumns: [marathon.id],
      name: "MarathonHour_marathonId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const marathon = danceblue.table("Marathon", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  year: text().notNull().unique(),
  startDate: timestamp({ precision: 6, withTimezone: true }),
  endDate: timestamp({ precision: 6, withTimezone: true }),
});
export const marathonRelations = relations(marathon, ({ many }) => ({
  pointOpportunitys: many(pointOpportunity),
  marathonHours: many(marathonHour),
  teams: many(team),
  dbFundsTeams: many(dbFundsTeam),
}));
export const marathonHourMapImageRelations = relations(
  marathonHourMapImage,
  ({ one }) => ({
    image: one(image, {
      fields: [marathonHourMapImage.imageId],
      references: [image.id],
    }),
    marathonHour: one(marathonHour, {
      fields: [marathonHourMapImage.marathonHourId],
      references: [marathonHour.id],
    }),
  })
);

export const marathonHourRelations = relations(
  marathonHour,
  ({ one, many }) => ({
    marathonHourMapImages: many(marathonHourMapImage),
    marathon: one(marathon, {
      fields: [marathonHour.marathonId],
      references: [marathon.id],
    }),
  })
);
