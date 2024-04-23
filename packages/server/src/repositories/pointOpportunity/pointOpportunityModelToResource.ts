import type { PointOpportunity } from "@prisma/client";
import { PointOpportunityNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function pointOpportunityModelToResource(
  pointOpportunityModel: PointOpportunity
): PointOpportunityNode {
  return PointOpportunityNode.init({
    uuid: pointOpportunityModel.uuid,
    name: pointOpportunityModel.name,
    type: pointOpportunityModel.type,
    opportunityDate: pointOpportunityModel.opportunityDate
      ? DateTime.fromJSDate(pointOpportunityModel.opportunityDate)
      : undefined,
    createdAt: pointOpportunityModel.createdAt,
    updatedAt: pointOpportunityModel.updatedAt,
  });
}
