import { PointOpportunityNode, TeamType } from "@ukdanceblue/common";

import type { PointOpportunity } from "@prisma/client";

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
