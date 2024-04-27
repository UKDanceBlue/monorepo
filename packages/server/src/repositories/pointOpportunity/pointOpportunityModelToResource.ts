import type { PointOpportunity } from "@prisma/client";
import { PointOpportunityNode } from "@ukdanceblue/common";

export function pointOpportunityModelToResource(
  pointOpportunityModel: PointOpportunity
): PointOpportunityNode {
  return PointOpportunityNode.init({
    id: pointOpportunityModel.uuid,
    name: pointOpportunityModel.name,
    type: pointOpportunityModel.type,
    opportunityDate: pointOpportunityModel.opportunityDate,
    createdAt: pointOpportunityModel.createdAt,
    updatedAt: pointOpportunityModel.updatedAt,
  });
}
