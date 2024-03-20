import type { MarathonHour } from "@prisma/client";
import { MarathonHourResource } from "@ukdanceblue/common";

export function marathonHourModelToResource(
  marathonHourModel: MarathonHour
): MarathonHourResource {
  return MarathonHourResource.init({
    uuid: marathonHourModel.uuid,
    title: marathonHourModel.title,
    details: marathonHourModel.details,
    durationInfo: marathonHourModel.durationInfo,
    shownStartingAt: marathonHourModel.shownStartingAt.toISOString(),
    createdAt: marathonHourModel.createdAt,
    updatedAt: marathonHourModel.updatedAt,
  });
}
