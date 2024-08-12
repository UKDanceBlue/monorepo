import { TeamType, TeamNode } from "@ukdanceblue/common";

import type { TeamLegacyStatus } from "@ukdanceblue/common";

export function teamModelToResource(teamModel: {
  uuid: string;
  name: string;
  type: TeamType | "Committee";
  legacyStatus: TeamLegacyStatus;
  createdAt: Date;
  updatedAt: Date;
}): TeamNode {
  if (teamModel.type === "Committee") {
    teamModel.type = TeamType.Spirit;
  }
  return TeamNode.init({
    id: teamModel.uuid,
    name: teamModel.name,
    type: teamModel.type,
    legacyStatus: teamModel.legacyStatus,
    createdAt: teamModel.createdAt,
    updatedAt: teamModel.updatedAt,
  });
}
