import type { Team } from "@prisma/client";
import { TeamNode } from "@ukdanceblue/common";

export function teamModelToResource(teamModel: Team): TeamNode {
  return TeamNode.init({
    id: teamModel.uuid,
    name: teamModel.name,
    type: teamModel.type,
    legacyStatus: teamModel.legacyStatus,
    createdAt: teamModel.createdAt,
    updatedAt: teamModel.updatedAt,
  });
}
