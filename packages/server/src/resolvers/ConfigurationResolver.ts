import {
  AccessLevel,
  AccessLevelAuthorized,
  ConfigurationResource,
  ErrorCode,
} from "@ukdanceblue/common";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import { ConfigurationModel } from "../models/Configuration.js";

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
class GetConfigurationByKeyResponse extends AbstractGraphQLOkResponse<ConfigurationResource> {
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
  @Query(() => GetConfigurationByKeyResponse, {
    name: "configuration",
  })
  async getByKey(
    @Arg("key") key: string
  ): Promise<GetConfigurationByKeyResponse> {
    const row = await ConfigurationModel.findOne({ where: { key } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }
    return GetConfigurationByKeyResponse.newOk(row.toResource());
  }

  @Query(() => GetAllConfigurationsResponse, { name: "allConfigurations" })
  async getAll(): Promise<GetAllConfigurationsResponse> {
    const resources = await ConfigurationModel.findAll();

    return GetAllConfigurationsResponse.newOk(
      resources.map((r) => r.toResource())
    );
  }

  @AccessLevelAuthorized(AccessLevel.Admin)
  @Mutation(() => CreateConfigurationResponse, { name: "createConfiguration" })
  async create(
    @Arg("input") input: CreateConfigurationInput
  ): Promise<CreateConfigurationResponse> {
    const row = await ConfigurationModel.create(input);

    return CreateConfigurationResponse.newCreated(row.toResource(), row.uuid);
  }

  @AccessLevelAuthorized(AccessLevel.Admin)
  @Mutation(() => SetConfigurationResponse, { name: "setConfiguration" })
  async set(
    @Arg("key") key: string,
    @Arg("input") input: SetConfigurationInput
  ): Promise<SetConfigurationResponse> {
    const row = await ConfigurationModel.findOne({ where: { key } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }
    await row.update(input);

    return SetConfigurationResponse.newOk(row.toResource());
  }

  @AccessLevelAuthorized(AccessLevel.Admin)
  @Mutation(() => DeleteConfigurationResponse, { name: "deleteConfiguration" })
  async delete(@Arg("uuid") id: string): Promise<DeleteConfigurationResponse> {
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
