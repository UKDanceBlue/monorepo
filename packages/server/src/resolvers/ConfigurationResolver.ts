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
import { ConcreteError } from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import { AsyncResult } from "ts-results-es";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import {
  mapToResource,
  mapToResources,
} from "#repositories/DefaultRepository.js";

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
  activeConfiguration(
    @Arg("key") key: string
  ): AsyncResult<GetConfigurationResponse, ConcreteError> {
    return this.configurationRepository
      .findConfigurationByKey(key, DateTime.now())
      .map((row) => {
        const resp = new GetConfigurationResponse();
        resp.data = row.toResource();
        return resp;
      });
  }

  @AccessControlAuthorized("get", "ConfigurationNode")
  @Query(() => ConfigurationNode, {
    name: "configuration",
    description: "Get a particular configuration entry by UUID",
  })
  configuration(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): AsyncResult<ConfigurationNode, ConcreteError> {
    return this.configurationRepository
      .findOne({
        by: { uuid: id },
      })
      .map(mapToResource);
  }

  @AccessControlAuthorized("list", "ConfigurationNode")
  @Query(() => [ConfigurationNode], {
    name: "allConfigurations",
    description: "Get all configurations, irrespective of time",
  })
  allConfigurations(): AsyncResult<ConfigurationNode[], ConcreteError> {
    return this.configurationRepository
      .findAll({
        sortBy: [{ field: "createdAt", direction: SortDirection.desc }],
      })
      .map(mapToResources);
  }

  @AccessControlAuthorized("create")
  @Mutation(() => ConfigurationNode, {
    name: "createConfiguration",
    description:
      "Create a new configuration, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
  createConfiguration(
    @Arg("input") input: CreateConfigurationInput
  ): AsyncResult<ConfigurationNode, ConcreteError> {
    return this.configurationRepository
      .create({
        init: {
          key: input.key,
          value: input.value,
          validAfter: dateTimeFromSomething(input.validAfter ?? null),
          validUntil: dateTimeFromSomething(input.validUntil ?? null),
        },
      })
      .map(mapToResource);
  }

  @AccessControlAuthorized("create")
  @Mutation(() => [ConfigurationNode], {
    name: "createConfigurations",
    description:
      "Create multiple configurations, superseding existing configurations with the same key (depending on the validAfter and validUntil fields)",
  })
  batchCreate(
    @Arg("input", () => [CreateConfigurationInput])
    input: CreateConfigurationInput[]
  ): AsyncResult<ConfigurationNode[], ConcreteError> {
    return this.configurationRepository
      .createMultiple({
        data: input.map((i) => ({
          init: {
            key: i.key,
            value: i.value,
            validAfter: dateTimeFromSomething(i.validAfter ?? null),
            validUntil: dateTimeFromSomething(i.validUntil ?? null),
          },
        })),
      })
      .map(mapToResources);
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => ConfigurationNode, {
    name: "deleteConfiguration",
    description: "Delete a configuration by UUID",
  })
  deleteConfiguration(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): AsyncResult<ConfigurationNode, ConcreteError> {
    return this.configurationRepository
      .delete({ by: { uuid: id } })
      .map(mapToResource);
  }
}
