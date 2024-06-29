import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessControl,
  AccessLevel,
  ConfigurationNode,
  DetailedError,
  ErrorCode,
  GlobalIdScalar,
  SortDirection,
  dateTimeFromSomething,
} from "@ukdanceblue/common";
import { DateTimeISOResolver } from "graphql-scalars";
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

import { auditLogger } from "../lib/logging/auditLogging.js";
import { ConfigurationRepository } from "../repositories/configuration/ConfigurationRepository.js";
import { configurationModelToResource } from "../repositories/configuration/configurationModelToResource.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
} from "./ApiResponse.js";

@ObjectType("GetConfigurationByUuidResponse", {
  implements: AbstractGraphQLOkResponse<ConfigurationNode>,
})
class GetConfigurationResponse extends AbstractGraphQLOkResponse<ConfigurationNode> {
  @Field(() => ConfigurationNode)
  data!: ConfigurationNode;
}
@ObjectType("GetAllConfigurationsResponse", {
  implements: AbstractGraphQLArrayOkResponse<ConfigurationNode>,
})
class GetAllConfigurationsResponse extends AbstractGraphQLArrayOkResponse<ConfigurationNode> {
  @Field(() => [ConfigurationNode])
  data!: ConfigurationNode[];
}
@ObjectType("CreateConfigurationResponse", {
  implements: AbstractGraphQLCreatedResponse<ConfigurationNode>,
})
class CreateConfigurationResponse extends AbstractGraphQLCreatedResponse<ConfigurationNode> {
  @Field(() => ConfigurationNode)
  data!: ConfigurationNode;
}
@ObjectType("CreateConfigurationsResponse", {
  implements: AbstractGraphQLCreatedResponse<ConfigurationNode>,
})
class CreateConfigurationsResponse extends AbstractGraphQLArrayOkResponse<ConfigurationNode> {
  @Field(() => [ConfigurationNode])
  data!: ConfigurationNode[];
}
@ObjectType("DeleteConfigurationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteConfigurationResponse extends AbstractGraphQLOkResponse<never> {}
@InputType()
class CreateConfigurationInput implements Partial<ConfigurationNode> {
  @Field()
  key!: string;

  @Field()
  value!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  validAfter!: Date | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  validUntil!: Date | null;
}

@Resolver(() => ConfigurationNode)
@Service()
export class ConfigurationResolver {
  constructor(
    private readonly configurationRepository: ConfigurationRepository
  ) {}
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
    const rows = await this.configurationRepository.findConfigurations(null, [
      ["createdAt", SortDirection.desc],
    ]);

    return GetAllConfigurationsResponse.newOk(
      rows.map(configurationModelToResource)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => CreateConfigurationResponse, { name: "createConfiguration" })
  async create(
    @Arg("input") input: CreateConfigurationInput
  ): Promise<CreateConfigurationResponse> {
    const row = await this.configurationRepository.createConfiguration({
      key: input.key,
      value: input.value,
      validAfter: dateTimeFromSomething(input.validAfter ?? null),
      validUntil: dateTimeFromSomething(input.validUntil ?? null),
    });

    auditLogger.dangerous("Configuration created", { configuration: row });

    return CreateConfigurationResponse.newCreated(
      configurationModelToResource(row),
      row.uuid
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => CreateConfigurationResponse, { name: "createConfigurations" })
  async batchCreate(
    @Arg("input", () => [CreateConfigurationInput])
    input: CreateConfigurationInput[]
  ): Promise<CreateConfigurationsResponse> {
    // TODO: This should be converted into a batch operation
    const rows = await Promise.all(
      input.map((i) =>
        this.configurationRepository.createConfiguration({
          key: i.key,
          value: i.value,
          validAfter: dateTimeFromSomething(i.validAfter ?? null),
          validUntil: dateTimeFromSomething(i.validUntil ?? null),
        })
      )
    );

    auditLogger.dangerous("Configurations created", {
      configurations: rows,
    });

    return CreateConfigurationsResponse.newOk(
      rows.map(configurationModelToResource)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => DeleteConfigurationResponse, { name: "deleteConfiguration" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeleteConfigurationResponse> {
    const row = await this.configurationRepository.deleteConfiguration(id);

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Configuration not found");
    }

    auditLogger.dangerous("Configuration deleted", { configuration: row });

    return DeleteConfigurationResponse.newOk(true);
  }
}
