import { Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AccessLevel,
  ConfigurationNode,
  dateTimeFromSomething,
  GlobalIdScalar,
  SortDirection,
} from "@ukdanceblue/common";
import {
  CreateConfigurationInput,
  GetConfigurationResponse,
} from "@ukdanceblue/common";
import {
  ConcreteResult,
  NotFoundError,
  toBasicError,
} from "@ukdanceblue/common/error";
import { readFile } from "fs/promises";
import { join } from "path";
import { Err, Ok } from "ts-results-es";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { logDirToken } from "#lib/typediTokens.js";
import { auditLogger, auditLoggerFileName } from "#logging/auditLogging.js";
import { configurationModelToResource } from "#repositories/configuration/configurationModelToResource.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";

@Resolver(() => ConfigurationNode)
@Service([ConfigurationRepository, logDirToken])
export class ConfigurationResolver {
  constructor(
    private readonly configurationRepository: ConfigurationRepository,
    private readonly logDir: string
  ) {}

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

  @AccessControlAuthorized({ accessLevel: AccessLevel.Admin })
  @Query(() => ConfigurationNode, {
    name: "configuration",
    description: "Get a particular configuration entry by UUID",
  })
  async getByUuid(
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

  @AccessControlAuthorized({ accessLevel: AccessLevel.Admin })
  @Query(() => [ConfigurationNode], {
    name: "allConfigurations",
    description: "Get all configurations, irrespective of time",
  })
  async getAll(): Promise<ConcreteResult<ConfigurationNode[]>> {
    const rows = await this.configurationRepository.findConfigurations(null, [
      ["createdAt", SortDirection.desc],
    ]);

    return Ok(rows.map(configurationModelToResource));
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.Admin })
  @Mutation(() => ConfigurationNode, {
    name: "createConfiguration",
    description:
      "Create a new configuration, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
  async create(
    @Arg("input") input: CreateConfigurationInput
  ): Promise<ConcreteResult<ConfigurationNode>> {
    const row = await this.configurationRepository.createConfiguration({
      key: input.key,
      value: input.value,
      validAfter: dateTimeFromSomething(input.validAfter ?? null),
      validUntil: dateTimeFromSomething(input.validUntil ?? null),
    });

    auditLogger.dangerous("Configuration created", { configuration: row });

    return Ok(configurationModelToResource(row));
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.Admin })
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

    auditLogger.dangerous("Configurations created", {
      configurations: rows,
    });

    return Ok(rows.map(configurationModelToResource));
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.Admin })
  @Mutation(() => ConfigurationNode, {
    name: "deleteConfiguration",
    description: "Delete a configuration by UUID",
  })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
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

    auditLogger.dangerous("Configuration deleted", { configuration: row });

    return Ok(configurationModelToResource(row));
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.SuperAdmin })
  @Query(() => String, {
    name: "auditLog",
    description: "Get the audit log file from the server",
  })
  async auditLog(
    @Arg("lines", { defaultValue: 25 }) lines: number,
    @Arg("offset", { defaultValue: 0 }) offset: number
  ): Promise<ConcreteResult<string>> {
    try {
      const fileLookup = await readFile(join(this.logDir, auditLoggerFileName));
      return Ok(
        fileLookup
          .toString("utf8")
          .split("\n")
          .reverse()
          .slice(offset, offset + lines)
          .join("\n")
      );
    } catch (error) {
      return Err(toBasicError(error));
    }
  }
}
