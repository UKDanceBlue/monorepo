import { ConfigurationResource, ErrorCode } from "@ukdanceblue/common";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import {
  ConfigurationIntermediate,
  ConfigurationModel,
} from "../models/Configuration.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  DetailedError,
} from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";

@ObjectType("GetConfigurationByUuidResponse", {
  implements: AbstractGraphQLOkResponse<ConfigurationResource>,
})
class GetConfigurationByUuidResponse extends AbstractGraphQLOkResponse<ConfigurationResource> {
  @Field(() => ConfigurationResource)
  data!: ConfigurationResource;
}
@ObjectType("GetAllConfigurationsResponse", {
  implements: AbstractGraphQLArrayOkResponse<ConfigurationResource>,
})
class GetAllConfigurationsResponse extends AbstractGraphQLArrayOkResponse<ConfigurationResource> {
  @Field(() => ConfigurationResource)
  data!: ConfigurationResource[];
}
@ObjectType("CreateConfigurationResponse", {
  implements: AbstractGraphQLCreatedResponse<ConfigurationResource>,
})
class CreateConfigurationResponse extends AbstractGraphQLCreatedResponse<ConfigurationResource> {
  @Field(() => ConfigurationResource)
  data!: ConfigurationResource;
}
@ObjectType("SetConfigurationResponse", {
  implements: AbstractGraphQLOkResponse<ConfigurationResource>,
})
class SetConfigurationResponse extends AbstractGraphQLOkResponse<ConfigurationResource> {
  @Field(() => ConfigurationResource)
  data!: ConfigurationResource;
}
@ObjectType("DeleteConfigurationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteConfigurationResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}
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
export class ConfigurationResolver
  implements ResolverInterface<ConfigurationResource>
{
  @Query(() => GetConfigurationByUuidResponse, {
    name: "getConfigurationByUuid",
  })
  async getByUuid(
    @Arg("uuid") uuid: string
  ): Promise<GetConfigurationByUuidResponse> {
    const row = await ConfigurationModel.findOne({ where: { key: uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }
    return GetConfigurationByUuidResponse.newOk(
      new ConfigurationIntermediate(row).toResource()
    );
  }

  @Query(() => GetAllConfigurationsResponse, { name: "getAllConfigurations" })
  async getAll(): Promise<GetAllConfigurationsResponse> {
    const resources = await ConfigurationModel.findAll();

    return GetAllConfigurationsResponse.newOk(
      resources.map((r) => new ConfigurationIntermediate(r).toResource())
    );
  }

  @Mutation(() => CreateConfigurationResponse, { name: "createConfiguration" })
  async create(
    @Arg("input") input: CreateConfigurationInput
  ): Promise<CreateConfigurationResponse> {
    const row = await ConfigurationModel.create(input);

    return CreateConfigurationResponse.newOk(
      new ConfigurationIntermediate(row).toResource()
    );
  }

  @Mutation(() => SetConfigurationResponse, { name: "setConfiguration" })
  async set(
    @Arg("id") id: string,
    @Arg("input") input: SetConfigurationInput
  ): Promise<SetConfigurationResponse> {
    const row = await ConfigurationModel.findOne({ where: { key: id } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }
    await row.update(input);

    return SetConfigurationResponse.newOk(
      new ConfigurationIntermediate(row).toResource()
    );
  }

  @Mutation(() => DeleteConfigurationResponse, { name: "deleteConfiguration" })
  async delete(@Arg("id") id: string): Promise<DeleteConfigurationResponse> {
    const row = await ConfigurationModel.findOne({
      where: { key: id },
      attributes: ["id"],
      include: [],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }
    await row.destroy();

    return DeleteConfigurationResponse.newOk(true);
  }
}
