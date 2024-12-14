import { boolean, serial, text } from "drizzle-orm/pg-core";

import { danceblue } from "#schema/core.sql.js";
import { timestamps, uuidField } from "#schema/fields.sql.js";
import { timestamp } from "#schema/types.sql.js";

export const configuration = danceblue.table("Configuration", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  key: text().notNull(),
  value: text().notNull(),
  validAfter: timestamp({ precision: 6, withTimezone: true }),
  validUntil: timestamp({ precision: 6, withTimezone: true }),
  ...timestamps(),
});

export const loginFlowSession = danceblue.table("LoginFlowSession", {
  id: serial().primaryKey().notNull(),
  uuid: uuidField(),
  ...timestamps(),
  codeVerifier: text().notNull(),
  redirectToAfterLogin: text().notNull(),
  setCookie: boolean().default(false).notNull(),
  sendToken: boolean().default(false).notNull(),
});
export const jobState = danceblue.table("JobState", {
  jobName: text().primaryKey().notNull(),
  lastRun: timestamp({
    precision: 6,
    withTimezone: true,
  }).notNull(),
});
