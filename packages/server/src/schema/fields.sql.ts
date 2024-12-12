import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

import { timestamp } from "#schema/types.sql.js";

export const timestampsBase = {
  createdAt: timestamp({ precision: 6, withTimezone: true }).notNull(),
  updatedAt: timestamp({
    precision: 6,
    withTimezone: true,
  }).notNull(),
};

export const timestamps = {
  createdAt: timestampsBase.createdAt.default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestampsBase.createdAt.notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const uuidField = uuid()
  .notNull()
  .default(sql`gen_random_uuid()`)
  .unique();
