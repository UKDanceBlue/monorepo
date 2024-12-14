import { relations } from "drizzle-orm";
import { integer, primaryKey, serial, text, unique } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import {
  authSource,
  committeeRole,
  membershipPosition,
} from "#schema/enums.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { auditLog } from "#schema/tables/audit.sql.js";
import { device } from "#schema/tables/device.sql.js";
import { file } from "#schema/tables/file.sql.js";
import {
  fundraisingAssignment,
  fundraisingEntry,
} from "#schema/tables/fundraising/entry.sql.js";
import { pointEntry } from "#schema/tables/points.sql.js";
import { team } from "#schema/tables/team.sql.js";
import { bytea, citext } from "#schema/types.sql.js";

export const person = danceblue.table("Person", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  name: citext("name"),
  email: citext("email").notNull().unique(),
  linkblue: citext("linkblue").unique(),
  hashedPassword: bytea("hashedPassword"),
  salt: bytea("salt"),
});
export const membership = danceblue.table(
  "Membership",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField(),
    ...timestamps(),
    personId: integer()
      .notNull()
      .references(() => person.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    teamId: integer()
      .notNull()
      .references(() => team.id, { onUpdate: "cascade", onDelete: "cascade" }),
    position: membershipPosition().notNull(),
    committeeRole: committeeRole(),
  },
  (table) => [unique().on(table.personId, table.teamId)]
);
export const authIdPair = danceblue.table(
  "AuthIdPair",
  {
    source: authSource().notNull(),
    value: text().notNull(),
    personId: integer()
      .notNull()
      .references(() => person.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.source, table.personId],
    }),
  ]
);
export const membershipRelations = relations(membership, ({ one }) => ({
  person: one(person, {
    fields: [membership.personId],
    references: [person.id],
  }),
  team: one(team, {
    fields: [membership.teamId],
    references: [team.id],
  }),
}));

export const personRelations = relations(person, ({ many }) => ({
  memberships: many(membership),
  pointEntrys: many(pointEntry),
  devices: many(device),
  fundraisingAssignments_assignedBy: many(fundraisingAssignment, {
    relationName: "fundraisingAssignment_assignedBy_person_id",
  }),
  fundraisingAssignments_personId: many(fundraisingAssignment, {
    relationName: "fundraisingAssignment_personId_person_id",
  }),
  files: many(file),
  fundraisingEntrys: many(fundraisingEntry),
  auditLogs: many(auditLog),
  authIdPairs: many(authIdPair),
}));
export const authIdPairRelations = relations(authIdPair, ({ one }) => ({
  person: one(person, {
    fields: [authIdPair.personId],
    references: [person.id],
  }),
}));
