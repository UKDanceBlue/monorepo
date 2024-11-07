import { Service } from "@freshgum/typedi";
import {
  DailyDepartmentNotification,
  DailyDepartmentNotificationBatch,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import {
  BatchType,
  DDNInit,
  extractDDNBatchType,
  SortDirection,
} from "@ukdanceblue/common";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import {
  buildDailyDepartmentNotificationOrder,
  buildDailyDepartmentNotificationWhere,
} from "./ddnRepositoryUtils.js";

// TODO: Add the keys for the DailyDepartmentNotification model
const dailyDepartmentNotificationBooleanKeys = [] as const;
type DailyDepartmentNotificationBooleanKey =
  (typeof dailyDepartmentNotificationBooleanKeys)[number];

const dailyDepartmentNotificationDateKeys = [] as const;
type DailyDepartmentNotificationDateKey =
  (typeof dailyDepartmentNotificationDateKeys)[number];

const dailyDepartmentNotificationIsNullKeys = [] as const;
type DailyDepartmentNotificationIsNullKey =
  (typeof dailyDepartmentNotificationIsNullKeys)[number];

const dailyDepartmentNotificationNumericKeys = [] as const;
type DailyDepartmentNotificationNumericKey =
  (typeof dailyDepartmentNotificationNumericKeys)[number];

const dailyDepartmentNotificationOneOfKeys = [] as const;
type DailyDepartmentNotificationOneOfKey =
  (typeof dailyDepartmentNotificationOneOfKeys)[number];

const dailyDepartmentNotificationStringKeys = [] as const;
type DailyDepartmentNotificationStringKey =
  (typeof dailyDepartmentNotificationStringKeys)[number];

export type DailyDepartmentNotificationOrderKeys = never;

export type DailyDepartmentNotificationFilters = FilterItems<
  DailyDepartmentNotificationBooleanKey,
  DailyDepartmentNotificationDateKey,
  DailyDepartmentNotificationIsNullKey,
  DailyDepartmentNotificationNumericKey,
  DailyDepartmentNotificationOneOfKey,
  DailyDepartmentNotificationStringKey
>;

interface UniqueDailyDepartmentNotificationParam {
  idSorter: string;
}

import { NotFoundError } from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";

import { prismaToken } from "#prisma";
import {
  handleRepositoryError,
  RepositoryError,
} from "#repositories/shared.js";

@Service([prismaToken])
export class DailyDepartmentNotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async findDDNByUnique(param: UniqueDailyDepartmentNotificationParam): Promise<
    Result<
      DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
      },
      RepositoryError
    >
  > {
    try {
      const row = await this.prisma.dailyDepartmentNotification.findUnique({
        where: param,
        include: { batch: true },
      });
      if (!row) {
        return Err(new NotFoundError({ what: "Marathon" }));
      }
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async listDDNs({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly DailyDepartmentNotificationFilters[] | undefined | null;
    order?:
      | readonly [
          key: DailyDepartmentNotificationOrderKeys,
          sort: SortDirection,
        ][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }): Promise<
    Result<
      (DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
      })[],
      RepositoryError
    >
  > {
    try {
      const where = buildDailyDepartmentNotificationWhere(filters);
      const orderBy = buildDailyDepartmentNotificationOrder(order);

      const rows = await this.prisma.dailyDepartmentNotification.findMany({
        where,
        orderBy,
        skip: skip ?? undefined,
        take: take ?? undefined,
        include: { batch: true },
      });

      return Ok(rows);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async countDDNs({
    filters,
  }: {
    filters?: readonly DailyDepartmentNotificationFilters[] | undefined | null;
  }): Promise<Result<number, RepositoryError>> {
    try {
      const where = buildDailyDepartmentNotificationWhere(filters);

      const count = await this.prisma.dailyDepartmentNotification.count({
        where,
      });

      return Ok(count);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async createDDN(data: DDNInit): Promise<
    Result<
      DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
      },
      RepositoryError
    >
  > {
    try {
      return Ok(
        await this.prisma.dailyDepartmentNotification.create({
          data: {
            ...data,
            batchId: undefined,
            batch: {
              connectOrCreate: {
                create: {
                  batchId: data.batchId,
                  batchType: extractDDNBatchType(data.batchId).unwrapOr(
                    BatchType.Unknown
                  ),
                },
                where: { batchId: data.batchId },
              },
            },
          },
          include: { batch: true },
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async updateDDN(
    param: UniqueDailyDepartmentNotificationParam,
    data: Omit<DDNInit, "batchId">
  ): Promise<
    Result<
      Option<
        DailyDepartmentNotification & {
          batch: DailyDepartmentNotificationBatch;
        }
      >,
      RepositoryError
    >
  > {
    try {
      return Ok(
        Some(
          await this.prisma.dailyDepartmentNotification.update({
            where: param,
            data: {
              ...data,
              batchId: undefined,
              batch: undefined,
            },
            include: { batch: true },
          })
        )
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Ok(None);
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async deleteDDN(param: UniqueDailyDepartmentNotificationParam): Promise<
    Result<
      Option<
        DailyDepartmentNotification & {
          batch: DailyDepartmentNotificationBatch;
        }
      >,
      RepositoryError
    >
  > {
    try {
      return Ok(
        Some(
          await this.prisma.dailyDepartmentNotification.delete({
            where: param,
            include: { batch: true },
          })
        )
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Ok(None);
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async batchLoadDDNs(data: DDNInit[]): Promise<
    Result<
      (DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
      })[],
      RepositoryError
    >
  > {
    try {
      const results = await this.prisma.$transaction(
        data.map((row) =>
          this.prisma.dailyDepartmentNotification.upsert({
            where: { idSorter: row.idSorter },
            update: {
              ...row,
              batchId: undefined,
              batch: {
                connectOrCreate: {
                  create: {
                    batchId: row.batchId,
                    batchType: extractDDNBatchType(row.batchId).unwrapOr(
                      BatchType.Unknown
                    ),
                  },
                  where: { batchId: row.batchId },
                },
              },
            },
            create: {
              ...row,
              batchId: undefined,
              batch: {
                connectOrCreate: {
                  create: {
                    batchId: row.batchId,
                    batchType: extractDDNBatchType(row.batchId).unwrapOr(
                      BatchType.Unknown
                    ),
                  },
                  where: { batchId: row.batchId },
                },
              },
            },
            include: { batch: true },
          })
        )
      );

      return Ok(results);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findBatchForDDN(
    param: UniqueDailyDepartmentNotificationParam
  ): Promise<Result<DailyDepartmentNotificationBatch, RepositoryError>> {
    try {
      const row = await this.prisma.dailyDepartmentNotification.findUnique({
        where: param,
        select: { batch: true },
      });
      if (!row) {
        return Err(new NotFoundError({ what: "Marathon" }));
      }
      return Ok(row.batch);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findBatchByBatchId(
    batchId: string
  ): Promise<Result<DailyDepartmentNotificationBatch, RepositoryError>> {
    try {
      const row = await this.prisma.dailyDepartmentNotificationBatch.findUnique(
        {
          where: { batchId },
        }
      );
      if (!row) {
        return Err(new NotFoundError({ what: "Marathon" }));
      }
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async deleteDDNBatch(
    batchId: string
  ): Promise<
    Result<Option<DailyDepartmentNotificationBatch>, RepositoryError>
  > {
    try {
      return Ok(
        Some(
          await this.prisma.dailyDepartmentNotificationBatch.delete({
            where: { batchId },
          })
        )
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Ok(None);
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async findDDNsByBatchId(batchId: string): Promise<
    Result<
      (DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
      })[],
      RepositoryError
    >
  > {
    try {
      const rows = await this.prisma.dailyDepartmentNotification.findMany({
        where: { batchId },
        include: { batch: true },
      });

      return Ok(rows);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }
}
