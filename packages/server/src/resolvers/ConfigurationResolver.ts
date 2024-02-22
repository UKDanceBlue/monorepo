import {
  AccessControl,
  AccessLevel,
  ConfigurationResource,
  DateTimeScalar,
  DetailedError,
  ErrorCode,
  SortDirection,
} from "@ukdanceblue/common";
import type { DateTime } from "luxon";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Service } from "typedi";

import { prisma } from "../prisma.js";
import { ConfigurationRepository } from "../repositories/configuration/ConfigurationRepository.js";
import { configurationModelToResource } from "../repositories/configuration/configurationModelToResource.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
} from "./ApiResponse.js";

@ObjectType("GetConfigurationByUuidResponse", {
  implements: AbstractGraphQLOkResponse<ConfigurationResource>,
})
class GetConfigurationResponse extends AbstractGraphQLOkResponse<ConfigurationResource> {
  @Field(() => ConfigurationResource)
  data!: ConfigurationResource;
}
@ObjectType("GetAllConfigurationsResponse", {
  implements: AbstractGraphQLArrayOkResponse<ConfigurationResource>,
})
class GetAllConfigurationsResponse extends AbstractGraphQLArrayOkResponse<ConfigurationResource> {
  @Field(() => [ConfigurationResource])
  data!: ConfigurationResource[];
}
@ObjectType("CreateConfigurationResponse", {
  implements: AbstractGraphQLCreatedResponse<ConfigurationResource>,
})
class CreateConfigurationResponse extends AbstractGraphQLCreatedResponse<ConfigurationResource> {
  @Field(() => ConfigurationResource)
  data!: ConfigurationResource;
}
@ObjectType("CreateConfigurationsResponse", {
  implements: AbstractGraphQLCreatedResponse<ConfigurationResource>,
})
class CreateConfigurationsResponse extends AbstractGraphQLArrayOkResponse<ConfigurationResource> {
  @Field(() => [ConfigurationResource])
  data!: ConfigurationResource[];
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
class DeleteConfigurationResponse extends AbstractGraphQLOkResponse<never> {}
@InputType()
class CreateConfigurationInput implements Partial<ConfigurationResource> {
  @Field()
  key!: string;

  @Field()
  value!: string;

  @Field(() => DateTimeScalar, { nullable: true })
  validAfter!: DateTime | null;

  @Field(() => DateTimeScalar, { nullable: true })
  validUntil!: DateTime | null;
}

@InputType()
class SetConfigurationInput implements Partial<ConfigurationResource> {
  @Field()
  key?: string;
}

@Resolver(() => ConfigurationResource)
@Service()
export class ConfigurationResolver
{
  constructor(private readonly configurationRepository: ConfigurationRepository) {}
  @Query(() => GetConfigurationResponse, {
    name: "activeConfiguration",
  })
  async activeConfiguration(
    @Arg("key") key: string
  ): Promise<GetConfigurationResponse> {
    const row = await this.configurationRepository.findConfigurationByKey(
      key,
      new Date()
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }

    return GetConfigurationResponse.newOk(configurationModelToResource(row));
  }

  @Query(() => GetAllConfigurationsResponse, { name: "allConfigurations" })
  async getAll(): Promise<GetAllConfigurationsResponse> {
    const rows = await this.configurationRepository.findConfigurations(
      null,
      [["createdAt", SortDirection.DESCENDING]],
    );

    return GetAllConfigurationsResponse.newOk(
      rows.map(configurationModelToResource)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => CreateConfigurationResponse, { name: "createConfiguration" })
  async create(
    @Arg("input") input: CreateConfigurationInput
  ): Promise<CreateConfigurationResponse> {
    const row = await this.configurationRepository.createConfiguration(
      { key: input.key, value: input.value, validAfter: input.validAfter ?? null, validUntil: input.validUntil ?? null }    );

    return CreateConfigurationResponse.newCreated(configurationModelToResource(row), row.uuid);
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => CreateConfigurationResponse, { name: "createConfigurations" })
  async batchCreate(
    @Arg("input", () => [CreateConfigurationInput])
    input: CreateConfigurationInput[]
  ): Promise<CreateConfigurationsResponse> {
    return prisma.$transaction(async () => {
    const rows = await Promise.all(
      input.map((i) =>
        this.configurationRepository.createConfiguration(
          { key: i.key, value: i.value, validAfter: i.validAfter ?? null, validUntil: i.validUntil ?? null }        )
      )
    );

    return CreateConfigurationsResponse.newOk(
      rows.map(configurationModelToResource)
    );
    });
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
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

  @AccessControl({ accessLevel: AccessLevel.Admin })
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
