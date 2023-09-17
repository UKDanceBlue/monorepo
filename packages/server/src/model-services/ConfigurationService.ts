import type { GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { ConfigurationIntermediate, ConfigurationModel } from "../models/Configuration.js";
import { modelServiceDeleteHelper, modelServiceGetByUuidHelper, modelServiceSetHelper } from "./helpers.js";

export class ConfigurationService implements GraphQLService.ConfigurationServiceInterface {
  async getByUuid(key: string) {
    return modelServiceGetByUuidHelper("Configuration", "key", key, ConfigurationModel, ConfigurationIntermediate);
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
    return modelServiceSetHelper("Configuration", key, affected, result, ConfigurationIntermediate)
  }

  async create(input: GraphQLResource.ConfigurationResource) {
    const configuration = await ConfigurationModel.create({
      key: input.key,
    });
    const data = new ConfigurationIntermediate(configuration).toResource();
    return {
      data,
      uuid: configuration.key,
    };
  }

  async delete(key: string) {
    return modelServiceDeleteHelper("Configuration", "key", key, ConfigurationModel);
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.configurationServiceToken, type: ConfigurationService });
