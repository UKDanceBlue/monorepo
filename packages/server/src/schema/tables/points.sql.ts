import { relations } from "drizzle-orm";
import { foreignKey, index, integer, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { pointOpportunityType } from "#schema/enums.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { event } from "#schema/tables/event.sql.js";
import { marathon } from "#schema/tables/marathon.sql.js";
import { person } from "#schema/tables/person.sql.js";
import { team } from "#schema/tables/team.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const pointEntry = danceblue.table(
  "PointEntry",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    comment: text(),
    points: integer().notNull(),
    personFromId: integer(),
    teamId: integer().notNull(),
    pointOpportunityId: integer(),
  },
  (table) => [
    index("PointEntry_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.personFromId],
      foreignColumns: [person.id],
      name: "PointEntry_personFromId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.pointOpportunityId],
      foreignColumns: [pointOpportunity.id],
      name: "PointEntry_pointOpportunityId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.id],
      name: "PointEntry_teamId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const pointOpportunity = danceblue.table(
  "PointOpportunity",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    name: text().notNull(),
    opportunityDate: timestamp({
      precision: 6,
      withTimezone: true,
    }),
    type: pointOpportunityType().notNull(),
    eventId: integer(),
    marathonId: integer().notNull(),
  },
  (table) => [
    index("PointOpportunity_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.marathonId],
      foreignColumns: [marathon.id],
      name: "PointOpportunity_marathonId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [event.id],
      name: "PointOpportunity_eventId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
  ]
);
export const pointEntryRelations = relations(pointEntry, ({ one }) => ({
  person: one(person, {
    fields: [pointEntry.personFromId],
    references: [person.id],
  }),
  pointOpportunity: one(pointOpportunity, {
    fields: [pointEntry.pointOpportunityId],
    references: [pointOpportunity.id],
  }),
  team: one(team, {
    fields: [pointEntry.teamId],
    references: [team.id],
  }),
}));

export const pointOpportunityRelations = relations(
  pointOpportunity,
  ({ one, many }) => ({
    pointEntrys: many(pointEntry),
    marathon: one(marathon, {
      fields: [pointOpportunity.marathonId],
      references: [marathon.id],
    }),
    event: one(event, {
      fields: [pointOpportunity.eventId],
      references: [event.id],
    }),
  })
);
