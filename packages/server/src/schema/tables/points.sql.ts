import { relations } from "drizzle-orm";
import { integer, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { pointOpportunityType } from "#schema/enums.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { event } from "#schema/tables/event.sql.js";
import { marathon } from "#schema/tables/marathon.sql.js";
import { person } from "#schema/tables/person.sql.js";
import { team } from "#schema/tables/team.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const pointEntry = danceblue.table("PointEntry", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  comment: text(),
  points: integer().notNull(),
  personFromId: integer().references(() => person.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  teamId: integer()
    .notNull()
    .references(() => team.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  pointOpportunityId: integer()
    .notNull()
    .references(() => pointOpportunity.id, {
      onUpdate: "cascade",
      onDelete: "set null",
    }),
});

export const pointOpportunity = danceblue.table("PointOpportunity", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  name: text().notNull(),
  opportunityDate: timestamp({
    precision: 6,
    withTimezone: true,
  }),
  type: pointOpportunityType().notNull(),
  eventId: integer().references(() => event.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  marathonId: integer()
    .notNull()
    .references(() => marathon.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
});
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
    pointEntries: many(pointEntry),
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
