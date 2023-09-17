import type { ApiError, GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { DeviceModel, DeviceIntermediate } from "../models/Device.js";
import { PersonModel } from "../models/Person.js";
import { InvariantError } from "../lib/CustomErrors.js";
import { modelServiceDeleteHelper, modelServiceGetByUuidHelper, modelServiceSetHelper } from "./helpers.js";

export class DeviceService implements GraphQLService.DeviceServiceInterface {
  async getByUuid(uuid: string): Promise<GraphQLResource.DeviceResource | ApiError<boolean> | null> {
    return modelServiceGetByUuidHelper("Device", "uuid", uuid, DeviceModel, DeviceIntermediate);
  }

  async create(input: Partial<GraphQLResource.DeviceResource>): Promise<ApiError<boolean> | { data?: GraphQLResource.DeviceResource; uuid: string; }> {
    let lastUserPk: number | null = null;
    if (input.lastUser) {
      const lastUser = await PersonModel.findOne({ where: { uuid: input.lastUser.personId }, attributes: ["id"], paranoid: false });
      if (!lastUser) {
        return {
          errorMessage: `Last user does not exist`,
          errorDetails: `Device had last user ${input.lastUser} but no such user exists`,
        };
      }
      // If the last user exists, but is deleted, we just pretend there was no last user
      if (!lastUser.deletedAt) {
        lastUserPk = lastUser.id;
      }
    }

    const device = await DeviceModel.create({
      uuid: input.deviceId,
      expoPushToken: input.expoPushToken ?? null,
      lastLogin: input.lastLogin?.toJSDate() ?? null,
      lastUserId: lastUserPk,
    });
    const data = new DeviceIntermediate(device).toResource();
    return {
      data,
      uuid: device.uuid,
    };
  }

  async set(uuid: string, input: Partial<GraphQLResource.DeviceResource>): Promise<GraphQLResource.DeviceResource | ApiError<boolean>> {
    const [affected, result] = await DeviceModel.update(
      {
        uuid,
        expoPushToken: input.expoPushToken ?? null,
        lastLogin: input.lastLogin?.toJSDate() ?? null,
      },
      {
        where: {
          uuid,
        },
        returning: true,
      },
    );
    return modelServiceSetHelper("Device", uuid, affected, result, DeviceIntermediate);
  }

  async delete(uuid: string): Promise<ApiError<boolean> | boolean> {
    return modelServiceDeleteHelper("Device", "uuid", uuid, DeviceModel);
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.deviceServiceToken, type: DeviceService });
