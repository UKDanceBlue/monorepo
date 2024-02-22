import type { PointOpportunity } from "@prisma/client";
import { PointOpportunityResource } from "@ukdanceblue/common";

export function pointOpportunityModelToResource(pointOpportunityModel: PointOpportunity): PointOpportunityResource {
  return PointOpportunityResource.init({
    uuid: pointOpportunityModel.uuid,
  });
}
