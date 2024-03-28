import type { PointOpportunity } from "@prisma/client";
import { PointOpportunityResource } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function pointOpportunityModelToResource(
  pointOpportunityModel: PointOpportunity
): PointOpportunityResource {
  return PointOpportunityResource.init({
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
