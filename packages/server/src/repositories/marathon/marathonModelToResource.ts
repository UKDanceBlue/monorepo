import type { Marathon } from "@prisma/client";
import { MarathonNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function marathonModelToResource(marathonModel: Marathon): MarathonNode {
  return MarathonNode.init({
    id: marathonModel.uuid,
    year: marathonModel.year,
    startDate:
      marathonModel.startDate && DateTime.fromJSDate(marathonModel.startDate),
    endDate:
      marathonModel.endDate && DateTime.fromJSDate(marathonModel.endDate),
    createdAt: DateTime.fromJSDate(marathonModel.createdAt),
    updatedAt: DateTime.fromJSDate(marathonModel.updatedAt),
  });
}
