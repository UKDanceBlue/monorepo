import type { Team } from "@prisma/client";
import { TeamResource } from "@ukdanceblue/common";

const marathonYearRegex = /^DB\d{2}$/;

export function teamModelToResource(teamModel: Team): TeamResource {
  if (!marathonYearRegex.test(teamModel.marathonYear)) {
    throw new Error(`Invalid marathon year: ${teamModel.marathonYear}`);
  }

  return TeamResource.init({
    uuid: teamModel.uuid,
    name: teamModel.name,
    persistentIdentifier: teamModel.persistentIdentifier,
    type: teamModel.type,
    legacyStatus: teamModel.legacyStatus,
    marathonYear: teamModel.marathonYear as `DB${number}`,
    createdAt: teamModel.createdAt,
    updatedAt: teamModel.updatedAt,
  });
}
