import type { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { TeamNode } from "@ukdanceblue/common";

export function teamModelToResource(teamModel: {
  uuid: string;
  name: string;
  type: TeamType;
  legacyStatus: TeamLegacyStatus;
  createdAt: Date;
  updatedAt: Date;
}): TeamNode {
  return TeamNode.init({
    id: teamModel.uuid,
    name: teamModel.name,
    type: teamModel.type,
    legacyStatus: teamModel.legacyStatus,
    createdAt: teamModel.createdAt,
    updatedAt: teamModel.updatedAt,
  });
}
