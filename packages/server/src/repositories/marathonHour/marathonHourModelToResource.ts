import { MarathonHourNode } from "@ukdanceblue/common";

import type { MarathonHour } from "@prisma/client";

export function marathonHourModelToResource(
  marathonHourModel: MarathonHour
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
