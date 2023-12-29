import { Op } from "@sequelize/core";
import {
  AccessControl,
  AccessLevel,
  ConfigurationResource,
  DateTimeScalar,
  DetailedError,
  ErrorCode,
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

import { ConfigurationModel } from "../models/Configuration.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
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
export class ConfigurationResolver
  implements ResolverInterface<ConfigurationResource>
{
  @Query(() => GetConfigurationByKeyResponse, {
    name: "configuration",
  })
  async getByUuid(
    @Arg("uuid") uuid: string
  ): Promise<GetConfigurationByKeyResponse> {
    const row = await ConfigurationModel.findByUuid(uuid);

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }
    return GetConfigurationByKeyResponse.newOk(row.toResource());
  }

  @Query(() => GetConfigurationByKeyResponse, {
    name: "activeConfiguration",
  })
  async getByKey(
    @Arg("key") key: string
  ): Promise<GetConfigurationByKeyResponse> {
    const rows = await ConfigurationModel.findAll({
      where: {
        key,
        validAfter: {
          [Op.or]: [null, { [Op.lte]: new Date() }],
        },
        validUntil: {
          [Op.or]: [null, { [Op.gte]: new Date() }],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    const row = rows[0];

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

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => CreateConfigurationResponse, { name: "createConfiguration" })
  async create(
    @Arg("input") input: CreateConfigurationInput
  ): Promise<CreateConfigurationResponse> {
    const row = await ConfigurationModel.create({
      key: input.key,
      value: input.value,
      validAfter: input.validAfter ? input.validAfter.toJSDate() : null,
      validUntil: input.validUntil ? input.validUntil.toJSDate() : null,
    });

    return CreateConfigurationResponse.newCreated(row.toResource(), row.uuid);
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
