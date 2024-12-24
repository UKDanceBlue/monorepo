import { MarathonHourNode } from "@ukdanceblue/common";
import type { InferSelectModel } from "drizzle-orm";

import type { marathonHour } from "#schema/tables/marathon.sql.js";

export function marathonHourModelToResource(
  marathonHourModel: InferSelectModel<typeof marathonHour>
): MarathonHourNode {
  return MarathonHourNode.init({
    id: marathonHourModel.uuid,
    title: marathonHourModel.title,
    details: marathonHourModel.details,
    durationInfo: marathonHourModel.durationInfo,
    shownStartingAt: marathonHourModel.shownStartingAt,
    createdAt: marathonHourModel.createdAt,
    updatedAt: marathonHourModel.updatedAt,
  });
}
