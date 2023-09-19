import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { ConfigurationResource, GraphQLErrorResponse, defineGraphQLArrayOkResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "@ukdanceblue/common";

import { resolverCreateHelper, resolverSetHelper } from "./helpers.js";
import { ResolverInterface } from "./BaseResolver.js";
import { ConfigurationIntermediate, ConfigurationModel } from "../models/Configuration.js";

const GetConfigurationByUuidResponse = defineGraphQlOkResponse("GetConfigurationByUuidResponse", ConfigurationResource);
const GetAllConfigurationsResponse = defineGraphQLArrayOkResponse("GetAllConfigurationsResponse", ConfigurationResource);
const CreateConfigurationResponse = defineGraphQlCreatedResponse("CreateConfigurationResponse", ConfigurationResource);
const SetConfigurationResponse = defineGraphQlOkResponse("SetConfigurationResponse", ConfigurationResource);
const DeleteConfigurationResponse = defineGraphQlOkResponse("DeleteConfigurationResponse", Boolean);

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

const GetByUuidResponseUnion = withGraphQLErrorUnion(GetConfigurationByUuidResponse, "GetConfigurationByUuidResponse");
const GetAllResponseUnion = withGraphQLErrorUnion(GetAllConfigurationsResponse, "GetAllConfigurationsResponse");
const CreateResponseUnion = withGraphQLErrorUnion(CreateConfigurationResponse, "CreateConfigurationResponse");
const SetResponseUnion = withGraphQLErrorUnion(SetConfigurationResponse, "SetConfigurationResponse");
const DeleteResponseUnion = withGraphQLErrorUnion(DeleteConfigurationResponse, "DeleteConfigurationResponse");

@Resolver(() => ConfigurationResource)
export class ConfigurationResolver implements ResolverInterface<ConfigurationResource> {
  @Query(() => GetByUuidResponseUnion, { name: "getConfigurationByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<typeof GetByUuidResponseUnion> {
    const row = await ConfigurationModel.findOne({ where: { key: uuid } });

    if (row == null) {
      return GraphQLErrorResponse.from("Configuration not found");
    }
    return GetConfigurationByUuidResponse.newOk(new ConfigurationIntermediate(row).toResource());
  }

  @Query(() => GetAllResponseUnion, { name: "getAllConfigurations" })
  async getAll(): Promise<typeof GetAllResponseUnion> {
    const resources = await this.service.getAll();
    if (resources instanceof Error) {
      return GraphQLErrorResponse.from(resources);
    }
    return GetAllConfigurationsResponse.newOk(resources);
  }

  @Mutation(() => CreateResponseUnion, { name: "createConfiguration" })
  async create(@Arg("input") input: CreateConfigurationInput): Promise<typeof CreateResponseUnion> {
    const result = await this.service.create(input);
    return resolverCreateHelper(CreateConfigurationResponse, result);
  }

  @Mutation(() => SetResponseUnion, { name: "setConfiguration" })
  async set(@Arg("id") id: string, @Arg("input") input: SetConfigurationInput): Promise<typeof SetResponseUnion> {
    const result = await this.service.set(id, input);
    return resolverSetHelper(SetConfigurationResponse, result);
  }

  @Mutation(() => DeleteResponseUnion, { name: "deleteConfiguration" })
  async delete(@Arg("id") id: string): Promise<typeof DeleteResponseUnion> {
    const result = await this.service.delete(id);
    return resolverSetHelper(DeleteConfigurationResponse, result);
  }
}
