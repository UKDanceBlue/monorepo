import type { MarathonHour } from "@prisma/client";
import { MarathonHourNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function marathonHourModelToResource(
  marathonHourModel: MarathonHour
): MarathonHourNode {
  return MarathonHourNode.init({
    id: marathonHourModel.uuid,
    title: marathonHourModel.title,
    details: marathonHourModel.details,
    durationInfo: marathonHourModel.durationInfo,
    shownStartingAt: DateTime.fromJSDate(marathonHourModel.shownStartingAt),
    createdAt: DateTime.fromJSDate(marathonHourModel.createdAt),
    updatedAt: DateTime.fromJSDate(marathonHourModel.updatedAt),
  });
}
