import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  ConfigurationNode,
  dateTimeFromSomething,
  DateTimeScalar,
  GlobalIdScalar,
  SortDirection,
} from "@ukdanceblue/common";
import {
  CreateConfigurationInput,
  GetConfigurationResponse,
} from "@ukdanceblue/common";
import { ConcreteResult, NotFoundError } from "@ukdanceblue/common/error";
import { readFile } from "fs/promises";
import { DateTime } from "luxon";
import { Err, None, Ok, type Option, Some } from "ts-results-es";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { fileURLToPath } from "url";

import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { isDevelopmentToken } from "#lib/typediTokens.js";
import { configurationModelToResource } from "#repositories/configuration/configurationModelToResource.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";

@Resolver(() => ConfigurationNode)
@Service([ConfigurationRepository, isDevelopmentToken])
export class ConfigurationResolver
  implements CrudResolver<ConfigurationNode, "configuration">
{
  constructor(
    private readonly configurationRepository: ConfigurationRepository,
    private readonly isDevelopment: boolean
  ) {}

  @Query(() => DateTimeScalar, { nullable: true })
  async buildTimestamp(): Promise<Option<DateTime>> {
    if (this.isDevelopment) {
      return None;
    }

    try {
      const file = await readFile(
        fileURLToPath(import.meta.resolve("#BUILD_TIME")),
        "utf8"
      );
      return Some(DateTime.fromISO(file.trim()));
    } catch (error) {
      return None;
    }
  }
  @AccessControlAuthorized("readActive", ["every", "ConfigurationNode"])
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
        new NotFoundError(
          `Configuration with key ${key}`,
          "activeConfiguration resolver"
        )
      );
    }

    const resp = new GetConfigurationResponse();
    resp.data = configurationModelToResource(row);
    return Ok(resp);
  }

  @AccessControlAuthorized("get", ["getId", "ConfigurationNode", "id"])
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
        new NotFoundError(
          `Configuration with UUID ${id}`,
          "configuration resolver"
        )
      );
    }

    return Ok(configurationModelToResource(row));
  }

  @AccessControlAuthorized("list", ["every", "ConfigurationNode"])
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

  @AccessControlAuthorized("create", ["every", "ConfigurationNode"])
  @Mutation(() => ConfigurationNode, {
    name: "createConfiguration",
    description:
      "Create a new configuration, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
  @WithAuditLogging()
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

  @AccessControlAuthorized("create", ["every", "ConfigurationNode"])
  @Mutation(() => [ConfigurationNode], {
    name: "createConfigurations",
    description:
      "Create multiple configurations, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
  @WithAuditLogging()
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

  @AccessControlAuthorized("delete", ["every", "ConfigurationNode"])
  @Mutation(() => ConfigurationNode, {
    name: "deleteConfiguration",
    description: "Delete a configuration by UUID",
  })
  @WithAuditLogging()
  async deleteConfiguration(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<ConfigurationNode>> {
    const row = await this.configurationRepository.deleteConfiguration(id);

    if (row == null) {
      return Err(
        new NotFoundError(
          `Configuration with UUID ${id}`,
          "deleteConfiguration resolver"
        )
      );
    }

    return Ok(configurationModelToResource(row));
  }
}
