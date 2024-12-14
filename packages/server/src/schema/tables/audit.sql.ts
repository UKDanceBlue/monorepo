import { relations } from "drizzle-orm";
import { integer, jsonb, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { person } from "#schema/tables/person.sql.js";

export const auditLog = danceblue.table("AuditLog", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  summary: text().notNull(),
  details: jsonb().notNull(),
  editingUserId: integer().references(() => person.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  subjectGlobalId: text(),
  createdAt: timestamps().createdAt,
});
export const auditLogRelations = relations(auditLog, ({ one }) => ({
  person: one(person, {
    fields: [auditLog.editingUserId],
    references: [person.id],
  }),
}));
