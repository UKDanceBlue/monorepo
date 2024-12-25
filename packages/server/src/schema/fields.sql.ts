import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

import { timestamp } from "#schema/types.sql.js";

export const timestamps = () => ({
  createdAt: timestamp({ precision: 6, withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp({
    precision: 6,
    withTimezone: true,
  })
    .notNull()
    .default(sql`now()`)
    .$onUpdate(() => sql`now()`),
});

export const uuidField = () => uuid().notNull().defaultRandom().unique();
