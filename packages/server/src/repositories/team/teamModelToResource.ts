import type { Team } from "@prisma/client";
import { TeamResource } from "@ukdanceblue/common";

export function teamModelToResource(teamModel: Team): TeamResource {
  return TeamResource.init({
    uuid: teamModel.uuid,
  });
}
