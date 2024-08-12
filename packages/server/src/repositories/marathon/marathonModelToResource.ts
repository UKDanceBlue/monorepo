import { MarathonNode } from "@ukdanceblue/common";

import type { Marathon } from "@prisma/client";

export function marathonModelToResource(marathonModel: Marathon): MarathonNode {
  return MarathonNode.init({
    id: marathonModel.uuid,
    year: marathonModel.year,
    startDate: marathonModel.startDate,
    endDate: marathonModel.endDate,
    createdAt: marathonModel.createdAt,
    updatedAt: marathonModel.updatedAt,
  });
}
