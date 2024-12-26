import { MarathonNode } from "@ukdanceblue/common";

import { buildDefaultDatabaseModel } from "#repositories/DefaultRepository.js";
import { marathon } from "#schema/tables/marathon.sql.js";

export class MarathonModel extends buildDefaultDatabaseModel(
  marathon,
  MarathonNode
) {
  protected rowToInitParams(
    row: typeof marathon.$inferSelect
  ): Parameters<typeof MarathonNode.init> {
    return [
      {
        id: row.uuid,
        year: row.year,
        startDate: row.startDate,
        endDate: row.endDate,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      },
    ];
  }
}
