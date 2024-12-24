import { MarathonNode } from "@ukdanceblue/common";
import type { InferSelectModel } from "drizzle-orm";

import type { marathon } from "#schema/tables/marathon.sql.js";

export function marathonModelToResource(
  marathonModel: InferSelectModel<typeof marathon>
): MarathonNode {
  return MarathonNode.init({
    id: marathonModel.uuid,
    year: marathonModel.year,
    startDate: marathonModel.startDate,
    endDate: marathonModel.endDate,
    createdAt: marathonModel.createdAt,
    updatedAt: marathonModel.updatedAt,
  });
}
