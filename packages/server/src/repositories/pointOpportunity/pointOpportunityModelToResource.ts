import type { PointOpportunity } from "@prisma/client";
import { PointOpportunityNode, TeamType } from "@ukdanceblue/common";

export function pointOpportunityModelToResource(
  pointOpportunityModel: PointOpportunity
): PointOpportunityNode {
  if (pointOpportunityModel.type === "Committee") {
    pointOpportunityModel.type = TeamType.Spirit;
  }
  return PointOpportunityNode.init({
    id: pointOpportunityModel.uuid,
    name: pointOpportunityModel.name,
    type: pointOpportunityModel.type,
    opportunityDate: pointOpportunityModel.opportunityDate,
    createdAt: pointOpportunityModel.createdAt,
    updatedAt: pointOpportunityModel.updatedAt,
  });
}
