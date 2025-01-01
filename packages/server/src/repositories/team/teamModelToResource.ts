import type { TeamLegacyStatus } from "@ukdanceblue/common";
import { TeamNode, TeamType } from "@ukdanceblue/common";
import { DateTime } from "luxon";

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
    createdAt: DateTime.fromJSDate(teamModel.createdAt),
    updatedAt: DateTime.fromJSDate(teamModel.updatedAt),
  });
}
