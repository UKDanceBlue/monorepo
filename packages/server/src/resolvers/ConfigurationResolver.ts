import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  ConfigurationNode,
  dateTimeFromSomething,
  GlobalIdScalar,
  SortDirection,
} from "@ukdanceblue/common";
import {
  CreateConfigurationInput,
  GetConfigurationResponse,
} from "@ukdanceblue/common";
import { ConcreteResult, NotFoundError } from "@ukdanceblue/common/error";
import { Err, Ok } from "ts-results-es";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { configurationModelToResource } from "#repositories/configuration/configurationModelToResource.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";

@Resolver(() => ConfigurationNode)
@Service([ConfigurationRepository])
export class ConfigurationResolver
  implements CrudResolver<ConfigurationNode, "configuration">
{
  constructor(
    private readonly configurationRepository: ConfigurationRepository
  ) {}

  @AccessControlAuthorized("readActive", "ConfigurationNode")
  @Query(() => GetConfigurationResponse, {
    name: "activeConfiguration",
    description:
      "Get the active configuration for a given key at the current time",
  })
  async activeConfiguration(
    @Arg("key") key: string
  ): Promise<ConcreteResult<GetConfigurationResponse>> {
    const row = await this.configurationRepository.findConfigurationByKey(
      key,
      new Date()
    );

    if (row == null) {
      return Err(
        new NotFoundError({
          what: `Configuration with key ${key}`,
          where: "activeConfiguration resolver",
        })
      );
    }

    const resp = new GetConfigurationResponse();
    resp.data = configurationModelToResource(row);
    return Ok(resp);
  }

  @AccessControlAuthorized("get", "ConfigurationNode")
  @Query(() => ConfigurationNode, {
    name: "configuration",
    description: "Get a particular configuration entry by UUID",
  })
  async configuration(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<ConfigurationNode>> {
    const row = await this.configurationRepository.findConfigurationByUnique({
      uuid: id,
    });

    if (row == null) {
      return Err(
        new NotFoundError({
          what: `Configuration with UUID ${id}`,
          where: "configuration resolver",
        })
      );
    }

    return Ok(configurationModelToResource(row));
  }

  @AccessControlAuthorized("list", "ConfigurationNode")
  @Query(() => [ConfigurationNode], {
    name: "allConfigurations",
    description: "Get all configurations, irrespective of time",
  })
  allConfigurations(): AsyncRepositoryResult<ConfigurationNode[]> {
    return this.configurationRepository
      .findAndCount({
        sortBy: [{ field: "createdAt", direction: SortDirection.desc }],
      })
      .map(({ selectedRows }) =>
        selectedRows.map(configurationModelToResource)
      );
  }

  @AccessControlAuthorized("create")
  @Mutation(() => ConfigurationNode, {
    name: "createConfiguration",
    description:
      "Create a new configuration, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
  async createConfiguration(
    @Arg("input") input: CreateConfigurationInput
  ): Promise<ConcreteResult<ConfigurationNode>> {
    const row = await this.configurationRepository.createConfiguration({
      key: input.key,
      value: input.value,
      validAfter: dateTimeFromSomething(input.validAfter ?? null),
      validUntil: dateTimeFromSomething(input.validUntil ?? null),
    });

    return Ok(configurationModelToResource(row));
  }

  @AccessControlAuthorized("create")
  @Mutation(() => [ConfigurationNode], {
    name: "createConfigurations",
    description:
      "Create multiple configurations, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
  async batchCreate(
    @Arg("input", () => [CreateConfigurationInput])
    input: CreateConfigurationInput[]
  ): Promise<ConcreteResult<ConfigurationNode[]>> {
    const rows = await this.configurationRepository.bulkCreateConfigurations(
      input.map((i) => ({
        key: i.key,
        value: i.value,
        validAfter: dateTimeFromSomething(i.validAfter ?? null),
        validUntil: dateTimeFromSomething(i.validUntil ?? null),
      }))
    );

    return Ok(rows.map(configurationModelToResource));
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => ConfigurationNode, {
    name: "deleteConfiguration",
    description: "Delete a configuration by UUID",
  })
  async deleteConfiguration(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<ConfigurationNode>> {
    const row = await this.configurationRepository.deleteConfiguration(id);

    if (row == null) {
      return Err(
        new NotFoundError({
          what: `Configuration with UUID ${id}`,
          where: "deleteConfiguration resolver",
        })
      );
    }

    return Ok(configurationModelToResource(row));
  }
}
