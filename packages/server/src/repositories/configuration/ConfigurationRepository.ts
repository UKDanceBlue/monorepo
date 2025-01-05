import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import type { DateTime } from "luxon";

import {
  type AsyncRepositoryResult,
  SimpleUniqueParam,
} from "#repositories/shared.js";

type ConfigurationKeys =
  | "key"
  | "value"
  | "validAfter"
  | "validUntil"
  | "createdAt"
  | "updatedAt";

import type { DefaultArgs } from "@prisma/client/runtime/library";
import { Ok } from "ts-results-es";

import { prismaToken } from "#lib/typediTokens.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";

@Service([prismaToken])
export class ConfigurationRepository extends buildDefaultRepository<
  PrismaClient["configuration"],
  SimpleUniqueParam,
  ConfigurationKeys,
  never
>("Configuration", {
  key: {
    getOrderBy: (sort) => Ok({ key: sort }),
    getWhere: (value) => Ok({ key: value }),
  },
  value: {
    getOrderBy: (sort) => Ok({ value: sort }),
    getWhere: (value) => Ok({ value }),
  },
  validAfter: {
    getOrderBy: (sort) => Ok({ validAfter: sort }),
    getWhere: (value) => Ok({ validAfter: value }),
  },
  validUntil: {
    getOrderBy: (sort) => Ok({ validUntil: sort }),
    getWhere: (value) => Ok({ validUntil: value }),
  },
  createdAt: {
    getOrderBy: (sort) => Ok({ createdAt: sort }),
    getWhere: (value) => Ok({ createdAt: value }),
  },
  updatedAt: {
    getOrderBy: (sort) => Ok({ updatedAt: sort }),
    getWhere: (value) => Ok({ updatedAt: value }),
  },
}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(
    by: SimpleUniqueParam
  ): Prisma.ConfigurationWhereUniqueInput {
    return ConfigurationRepository.simpleUniqueToWhere(by);
  }

  // Finders
  findConfigurationByUnique(param: SimpleUniqueParam) {
    return this.prisma.configuration.findUnique({ where: param });
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<ConfigurationKeys>): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.ConfigurationDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: never }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).configuration.findMany({
            ...params,
          })
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).configuration.count(params)
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
  }

  findConfigurationByKey(key: string, at: Date | undefined) {
    return this.prisma.configuration.findFirst({
      where: {
        key,
        AND: at
          ? [
              {
                OR: [{ validAfter: null }, { validAfter: { lte: at } }],
              },
              {
                OR: [{ validUntil: null }, { validUntil: { gte: at } }],
              },
            ]
          : [],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Mutators

  async createConfiguration({
    key,
    value,
    validAfter,
    validUntil,
  }: {
    key: string;
    value: string;
    validAfter: DateTime | null;
    validUntil: DateTime | null;
  }) {
    const validAfterDate = validAfter?.toJSDate() ?? null;
    const validUntilDate = validUntil?.toJSDate() ?? null;

    const existing = await this.prisma.configuration.findFirst({
      where: {
        key,
        value,
        validAfter: validAfterDate,
        validUntil: validUntilDate,
      },
    });

    if (existing) {
      return existing;
    }
    return this.prisma.configuration.create({
      data: {
        key,
        value,
        validAfter: validAfterDate,
        validUntil: validUntilDate,
      },
    });
  }

  async bulkCreateConfigurations(
    configurations: {
      key: string;
      value: string;
      validAfter: DateTime | null;
      validUntil: DateTime | null;
    }[]
  ) {
    const existingConfigurations = await Promise.all(
      configurations.map(async (configuration) => {
        const existing = await this.prisma.configuration.findFirst({
          where: {
            key: configuration.key,
            value: configuration.value,
            validAfter: configuration.validAfter?.toJSDate() ?? null,
            validUntil: configuration.validUntil?.toJSDate() ?? null,
          },
        });

        return [configuration, existing] as const;
      })
    );

    const newConfigurations = existingConfigurations.filter(
      ([_, existing]) => !existing
    );

    return this.prisma.configuration.createManyAndReturn({
      data: newConfigurations.map(([configuration]) => ({
        key: configuration.key,
        value: configuration.value,
        validAfter: configuration.validAfter?.toJSDate() ?? null,
        validUntil: configuration.validUntil?.toJSDate() ?? null,
      })),
    });
  }

  deleteConfiguration(uuid: string) {
    try {
      return this.prisma.configuration.delete({ where: { uuid } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }
}
