import type { PointOpportunity } from "@prisma/client";
import { PointOpportunityNode, TeamType } from "@ukdanceblue/common";
import { DateTime } from "luxon";

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
    opportunityDate:
      pointOpportunityModel.opportunityDate &&
      DateTime.fromJSDate(pointOpportunityModel.opportunityDate),
    createdAt: DateTime.fromJSDate(pointOpportunityModel.createdAt),
    updatedAt: DateTime.fromJSDate(pointOpportunityModel.updatedAt),
  });
}
