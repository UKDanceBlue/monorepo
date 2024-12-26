import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";

import { timestamp } from "#schema/types.sql.js";

export const timestamps = () => ({
  createdAt: timestamp({ precision: 6, withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`.getSQL()),
  updatedAt: timestamp({
    precision: 6,
    withTimezone: true,
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`.getSQL())
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`.getSQL()),
});

export const uuidField = () => uuid().notNull().defaultRandom().unique();
