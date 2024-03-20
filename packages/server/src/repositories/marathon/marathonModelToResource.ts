import type { Marathon } from "@prisma/client";
import { MarathonResource } from "@ukdanceblue/common";

export function marathonModelToResource(
  marathonModel: Marathon
): MarathonResource {
  return MarathonResource.init({
    uuid: marathonModel.uuid,
    year: marathonModel.year,
    startDate: marathonModel.startDate.toISOString(),
    endDate: marathonModel.endDate.toISOString(),
    createdAt: marathonModel.createdAt,
    updatedAt: marathonModel.updatedAt,
  });
}
