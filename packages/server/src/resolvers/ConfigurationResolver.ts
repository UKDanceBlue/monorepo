import { auditLogger, auditLoggerFileName } from "#logging/auditLogging.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import { configurationModelToResource } from "#repositories/configuration/configurationModelToResource.js";

import {
  AccessControl,
  AccessLevel,
  ConfigurationNode,
  LegacyError,
  LegacyErrorCode,
  GlobalIdScalar,
  SortDirection,
  dateTimeFromSomething,
} from "@ukdanceblue/common";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "@freshgum/typedi";

import type { GlobalId } from "@ukdanceblue/common";
import { readFile } from "fs/promises";
import { join } from "path";
import { logDir } from "#environment";
import {
  GetConfigurationResponse,
  GetAllConfigurationsResponse,
  CreateConfigurationResponse,
  CreateConfigurationInput,
  CreateConfigurationsResponse,
  DeleteConfigurationResponse,
} from "@ukdanceblue/common";

@Resolver(() => ConfigurationNode)
@Service([ConfigurationRepository])
export class ConfigurationResolver {
  constructor(
    private readonly configurationRepository: ConfigurationRepository
  ) {}
  @Query(() => GetConfigurationResponse, {
    name: "activeConfiguration",
    description:
      "Get the active configuration for a given key at the current time",
  })
  async activeConfiguration(
    @Arg("key") key: string
  ): Promise<GetConfigurationResponse> {
    const row = await this.configurationRepository.findConfigurationByKey(
      key,
      new Date()
    );

    if (row == null) {
      throw new LegacyError(
        LegacyErrorCode.NotFound,
        "Configuration not found"
      );
    }

    return GetConfigurationResponse.newOk(configurationModelToResource(row));
  }

  @Query(() => GetConfigurationResponse, {
    name: "configuration",
    description: "Get a particular configuration entry by UUID",
  })
  async getByUuid(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<GetConfigurationResponse> {
    const row = await this.configurationRepository.findConfigurationByUnique({
      uuid: id,
    });

    if (row == null) {
      throw new LegacyError(
        LegacyErrorCode.NotFound,
        "Configuration not found"
      );
    }

    return GetConfigurationResponse.newOk(configurationModelToResource(row));
  }

  @Query(() => GetAllConfigurationsResponse, {
    name: "allConfigurations",
    description: "Get all configurations, irrespective of time",
  })
  async getAll(): Promise<GetAllConfigurationsResponse> {
    const rows = await this.configurationRepository.findConfigurations(null, [
      ["createdAt", SortDirection.desc],
    ]);

    return GetAllConfigurationsResponse.newOk(
      rows.map(configurationModelToResource)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => CreateConfigurationResponse, {
    name: "createConfiguration",
    description:
      "Create a new configuration, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
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
      configurationModelToResource(row)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Admin })
  @Mutation(() => CreateConfigurationResponse, {
    name: "createConfigurations",
    description:
      "Create multiple configurations, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
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
  @Mutation(() => DeleteConfigurationResponse, {
    name: "deleteConfiguration",
    description: "Delete a configuration by UUID",
  })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeleteConfigurationResponse> {
    const row = await this.configurationRepository.deleteConfiguration(id);

    if (row == null) {
      throw new LegacyError(
        LegacyErrorCode.NotFound,
        "Configuration not found"
      );
    }

    auditLogger.dangerous("Configuration deleted", { configuration: row });

    return DeleteConfigurationResponse.newOk(true);
  }

  @AccessControl({ accessLevel: AccessLevel.SuperAdmin })
  @Query(() => String, {
    name: "auditLog",
    description: "Get the audit log file from the server",
  })
  async auditLog(
    @Arg("lines", { defaultValue: 25 }) lines: number,
    @Arg("offset", { defaultValue: 0 }) offset: number
  ): Promise<string> {
    const fileLookup = await readFile(join(logDir, auditLoggerFileName));
    return fileLookup
      .toString("utf8")
      .split("\n")
      .reverse()
      .slice(offset, offset + lines)
      .join("/n");
  }
}
