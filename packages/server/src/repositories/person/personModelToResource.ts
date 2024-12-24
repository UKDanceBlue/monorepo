import { PersonNode } from "@ukdanceblue/common";
import type { InferSelectModel } from "drizzle-orm";

import type { person } from "#schema/tables/person.sql.js";

export function personModelToResource(
  row: InferSelectModel<typeof person>
): PersonNode {
  return PersonNode.init({
    id: row.uuid,
    name: row.name,
    email: row.email,
    linkblue: row.linkblue?.toLowerCase(),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
