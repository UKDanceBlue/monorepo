import type { GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { ConfigurationIntermediate, ConfigurationModel } from "../models/Configuration.js";

export class ConfigurationService implements GraphQLService.ConfigurationServiceInterface {
  async getByUuid(key: string) {
    const result = await ConfigurationModel.findOne({
      where: {
        key,
      },
    });
    if (!result) {
      return null;
    }
    const intermediate = new ConfigurationIntermediate(result);
    return intermediate.toResource();
  }

  async getAll() {
    const results = await ConfigurationModel.findAll();
    return results.map((result) => new ConfigurationIntermediate(result).toResource());
  }

  async set(key: string, input: GraphQLResource.ConfigurationResource) {
    const [affected, result] = await ConfigurationModel.update(
      {
        key: input.key,
      },
      {
        where: {
          key,
        },
        returning: true,
      },
    );
    if (affected === 0) {
      return {
        errorMessage: `Configuration does not exist`,
        errorDetails: `Configuration with key ${key} does not exist`,
      };
    } else if (affected > 1) {
      throw new InvariantError(`More than one configuration with key ${key} exists`);
    } else if (result[0]) {
      return new ConfigurationIntermediate(result[0]).toResource();
    } else {
      throw new InvariantError(`No value returned from update`);
    }
  }

  async create(input: GraphQLResource.ConfigurationResource) {
    const configuration = await ConfigurationModel.create({
      key: input.key,
    });
    const data = new ConfigurationIntermediate(configuration).toResource();
    console.log(data);
    return {
      data,
      uuid: configuration.key,
    };
  }

  async delete(key: string) {
    const deletedCount = await ConfigurationModel.destroy({
      where: {
        key,
      },
    });
    return deletedCount > 0;
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.configurationServiceToken, type: ConfigurationService });