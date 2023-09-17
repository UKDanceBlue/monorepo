import type { ApiError, GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { modelServiceDeleteHelper, modelServiceGetByUuidHelper, modelServiceSetHelper } from "./helpers.js";
import { PointEntryModel, PointEntryIntermediate } from "../models/PointEntry.js";

export class PointEntryService implements GraphQLService.PointEntryServiceInterface {
  async getByUuid(uuid: string) {
    return modelServiceGetByUuidHelper("PointEntry", "uuid", uuid, PointEntryModel, PointEntryIntermediate);
  }

  async set(uuid: string, input: Partial<GraphQLResource.PointEntryResource>): Promise<GraphQLResource.PointEntryResource | ApiError<boolean>> {
    const [affected, result] = await PointEntryModel.update(
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
    return modelServiceSetHelper("PointEntry", uuid, affected, result, PointEntryIntermediate);
  }

  async create(input: GraphQLResource.PointEntryResource): Promise<ApiError<boolean> | { data?: GraphQLResource.PointEntryResource; uuid: string; }> {
    const pointEntry = await PointEntryModel.create({
      comment: input.comment ?? '', // TODO: Update model to allow null
      points: input.points,
      type: input.type,
      // TODO: Finish
    });
    const data = new PointEntryIntermediate(pointEntry).toResource();
    return {
      data,
      uuid: pointEntry.uuid,
    };
  }

  async delete(uuid: string): Promise<ApiError<boolean> | boolean> {
    return modelServiceDeleteHelper("PointEntry", "uuid", uuid, PointEntryModel);
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.pointEntryServiceToken, type: PointEntryService });
