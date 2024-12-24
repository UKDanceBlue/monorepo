import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

import { timestamp } from "#schema/types.sql.js";

export const timestamps = () => ({
  createdAt: timestamp({ precision: 6, withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp({
    precision: 6,
    withTimezone: true,
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const uuidField = () => uuid().notNull().defaultRandom().unique();
