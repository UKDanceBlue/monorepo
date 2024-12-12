import { boolean, index, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const configuration = danceblue.table(
  "Configuration",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    key: text().notNull(),
    value: text().notNull(),
    validAfter: timestamp({ precision: 6, withTimezone: true }),
    validUntil: timestamp({ precision: 6, withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("Configuration_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),
  ]
);

export const loginFlowSession = danceblue.table(
  "LoginFlowSession",
  {
    id: serial().primaryKey().notNull(),
    uuid: uuidField,
    ...timestamps,
    codeVerifier: text().notNull(),
    redirectToAfterLogin: text().notNull(),
    setCookie: boolean().default(false).notNull(),
    sendToken: boolean().default(false).notNull(),
  },
  (table) => [
    index("LoginFlowSession_uuid_idx").using(
      "btree",
      table.uuid.asc().nullsLast().op("uuid_ops")
    ),
  ]
);
export const jobState = danceblue.table("JobState", {
  jobName: text().primaryKey().notNull(),
  lastRun: timestamp({
    precision: 6,
    withTimezone: true,
  }).notNull(),
});
