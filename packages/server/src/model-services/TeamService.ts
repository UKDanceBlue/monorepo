import type { GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { modelServiceDeleteHelper, modelServiceGetByUuidHelper, modelServiceSetHelper } from "./helpers.js";
import { TeamModel, TeamIntermediate } from "../models/Team.js";

export class TeamService implements GraphQLService.TeamServiceInterface {
  async getByUuid(uuid: string): Promise<GraphQLResource.TeamResource | null> {
    return modelServiceGetByUuidHelper("Team", "uuid", uuid, TeamModel, TeamIntermediate);
  }

  async set(uuid: string, data: GraphQLResource.TeamResource) {
    const [affected, result] = await TeamModel.update(
      {
        // TODO: Implement
      },
      {
        where: {
          uuid,
        },
        returning: true,
      },
    );
    return modelServiceSetHelper("Team", uuid, affected, result, TeamIntermediate);
  }

  async create(data: GraphQLResource.TeamResource) {
    const team = await TeamModel.create({
      name: data.name,
      type: data.type,
      visibility: data.visibility,
    });
    const teamData = new TeamIntermediate(team).toResource();
    return {
      data: teamData,
      uuid: team.uuid,
    };
  }

  async delete(uuid: string) {
    return modelServiceDeleteHelper("Team", "uuid", uuid, TeamModel);
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.teamServiceToken, type: TeamService });