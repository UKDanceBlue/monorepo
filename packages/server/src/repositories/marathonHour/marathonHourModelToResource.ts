import type { MarathonHour } from "@prisma/client";
import { MarathonHourResource } from "@ukdanceblue/common";

export function marathonHourModelToResource(
  marathonHourModel: MarathonHour
): MarathonHourResource {
  return MarathonHourResource.init({
    uuid: marathonHourModel.uuid,
    // TODO: Add the rest of the fields
    createdAt: marathonHourModel.createdAt,
    updatedAt: marathonHourModel.updatedAt,
  });
}
