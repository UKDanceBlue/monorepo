import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  primaryKey,
  serial,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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

export const person = danceblue.table(
  "Person",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    name: citext("name"),
    email: citext("email").notNull(),
    linkblue: citext("linkblue"),
    hashedPassword: bytea("hashedPassword"),
    salt: bytea("salt"),
  },
  (table) => [
    uniqueIndex("Person_email_key").using(
      "btree",
      table.email.asc().nullsLast().op("citext_ops")
    ),
    uniqueIndex("Person_linkblue_key").using(
      "btree",
      table.linkblue.asc().nullsLast().op("citext_ops")
    ),
    index("Person_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),
  ]
);
export const membership = danceblue.table(
  "Membership",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    personId: integer().notNull(),
    teamId: integer().notNull(),
    position: membershipPosition().notNull(),
    committeeRole: committeeRole(),
  },
  (table) => [
    uniqueIndex("Membership_personId_teamId_key").using(
      "btree",
      table.personId.asc().nullsLast().op("int4_ops"),
      table.teamId.asc().nullsLast().op("int4_ops")
    ),
    index("Membership_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),

    foreignKey({
      columns: [table.personId],
      foreignColumns: [person.id],
      name: "Membership_personId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.id],
      name: "Membership_teamId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);
export const authIdPair = danceblue.table(
  "AuthIdPair",
  {
    source: authSource().notNull(),
    value: text().notNull(),
    personId: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.personId],
      foreignColumns: [person.id],
      name: "AuthIdPair_personId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    primaryKey({
      columns: [table.source, table.personId],
      name: "AuthIdPair_pkey",
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
