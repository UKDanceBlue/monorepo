import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import type { AbstractGraphQLArrayOkResponse } from "../object-types/ApiResponse.js";
import { GraphQLErrorResponse, defineGraphQLArrayOkResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "../object-types/ApiResponse.js";
import { ConfigurationResource } from "../object-types/Configuration.js";
import type { ConfigurationServiceInterface } from "../service-declarations/ConfigurationServiceInterface.js";
import { configurationServiceToken } from "../service-declarations/ConfigurationServiceInterface.js";

import { createBaseResolver } from "./BaseResolver.js";

const ConfigurationResourceBaseResolver = createBaseResolver<ConfigurationResource, ConfigurationServiceInterface>("Configuration", ConfigurationResource, configurationServiceToken);

const GetAllConfigurationsResponse = defineGraphQLArrayOkResponse("GetAllConfigurationsResponse", ConfigurationResource);
const CreateConfigurationResponse = defineGraphQlCreatedResponse("CreateConfigurationResponse", ConfigurationResource);
const SetConfigurationResponse = defineGraphQlOkResponse("SetConfigurationResponse", ConfigurationResource);

@InputType()
class CreateConfigurationInput implements Partial<ConfigurationResource> {
  @Field()
  key!: string;
}

@InputType()
class SetConfigurationInput implements Partial<ConfigurationResource> {
  @Field()
  key?: string;
}

@Resolver(() => ConfigurationResource)
export class ConfigurationResolver extends ConfigurationResourceBaseResolver {
  @Query(() => withGraphQLErrorUnion(GetAllConfigurationsResponse), { name: "getAllConfigurations" })
  async getAll(): Promise<AbstractGraphQLArrayOkResponse<ConfigurationResource> | GraphQLErrorResponse> {
    const resources = await this.service.getAll();
    if (resources instanceof Error) {
      return GraphQLErrorResponse.from(resources);
    }
    return GetAllConfigurationsResponse.newOk(resources);
  }

  @Mutation(() => withGraphQLErrorUnion(CreateConfigurationResponse), { name: "createConfiguration" })
  async create(@Arg("input") input: CreateConfigurationInput): Promise<AbstractGraphQLArrayOkResponse<ConfigurationResource> | GraphQLErrorResponse> {
    const result = await this.service.create(input);
    if (!("uuid" in result)) {
      return GraphQLErrorResponse.from(result);
    }

    const response = CreateConfigurationResponse.newOk(result);
    response.uuid = result.uuid;
    return response;
  }

  @Mutation(() => withGraphQLErrorUnion(SetConfigurationResponse), { name: "setConfiguration" })
  async set(@Arg("id") id: string, @Arg("input") input: SetConfigurationInput): Promise<AbstractGraphQLArrayOkResponse<ConfigurationResource> | GraphQLErrorResponse> {
    const result = await this.service.set(id, input);
    if (result instanceof Error) {
      return GraphQLErrorResponse.from(result);
    }
    return SetConfigurationResponse.newOk(result);
  }
}
