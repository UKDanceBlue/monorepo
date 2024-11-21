import { Service } from "@freshgum/typedi";
import {
  DailyDepartmentNotification,
  DailyDepartmentNotificationBatch,
  DDNDonor,
  DDNDonorLink,
  Prisma,
  PrismaClient,
  SolicitationCode,
} from "@prisma/client";
import { DDNInit, localDateToJs, SortDirection } from "@ukdanceblue/common";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import {
  buildDailyDepartmentNotificationOrder,
  buildDailyDepartmentNotificationWhere,
} from "./ddnRepositoryUtils.js";

const dailyDepartmentNotificationBooleanKeys = [] as const;
type DailyDepartmentNotificationBooleanKey =
  (typeof dailyDepartmentNotificationBooleanKeys)[number];

const dailyDepartmentNotificationDateKeys = [] as const;
type DailyDepartmentNotificationDateKey =
  (typeof dailyDepartmentNotificationDateKeys)[number];

const dailyDepartmentNotificationIsNullKeys = [] as const;
type DailyDepartmentNotificationIsNullKey =
  (typeof dailyDepartmentNotificationIsNullKeys)[number];

const dailyDepartmentNotificationNumericKeys = ["Amount"] as const;
type DailyDepartmentNotificationNumericKey =
  (typeof dailyDepartmentNotificationNumericKeys)[number];

const dailyDepartmentNotificationOneOfKeys = [
  "BatchType",
  "SolicitationCodePrefix",
  "SolicitationCodeNumber",
] as const;
type DailyDepartmentNotificationOneOfKey =
  (typeof dailyDepartmentNotificationOneOfKeys)[number];

const dailyDepartmentNotificationStringKeys = [
  "Donor",
  "Comment",
  "SolicitationCodeName",
] as const;
type DailyDepartmentNotificationStringKey =
  (typeof dailyDepartmentNotificationStringKeys)[number];

export type DailyDepartmentNotificationOrderKeys =
  | DailyDepartmentNotificationNumericKey
  | DailyDepartmentNotificationStringKey
  | DailyDepartmentNotificationOneOfKey;

export type DailyDepartmentNotificationFilters = FilterItems<
  DailyDepartmentNotificationBooleanKey,
  DailyDepartmentNotificationDateKey,
  DailyDepartmentNotificationIsNullKey,
  DailyDepartmentNotificationNumericKey,
  DailyDepartmentNotificationOneOfKey,
  DailyDepartmentNotificationStringKey
>;

type UniqueDailyDepartmentNotificationParam =
  | SimpleUniqueParam
  | {
      idSorter: string;
    };

type UniqueDailyDepartmentNotificationBatchParam =
  | SimpleUniqueParam
  | {
      batchId: string;
    };

import { InvalidArgumentError, NotFoundError } from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";

import { prismaToken } from "#lib/typediTokens.js";
import {
  handleRepositoryError,
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";

function parseSolicitationCode(
  solicitationCodeString: string
): Result<{ prefix: string; code: number }, InvalidArgumentError> {
  let prefix = "";
  // Read the string prefix character by character until a digit is found
  for (const char of solicitationCodeString) {
    if (char >= "0" && char <= "9") {
      break;
    }
    prefix += char;
  }
  if (prefix.length === 0) {
    return Err(
      new InvalidArgumentError(
        "Solicitation code must start with a alphabetic prefix"
      )
    );
  }
  const code = Number.parseInt(solicitationCodeString.slice(prefix.length), 10);
  if (Number.isNaN(code)) {
    return Err(
      new InvalidArgumentError("Solicitation code must end with a number")
    );
  }
  if (code < 0 || code > 9999) {
    return Err(
      new InvalidArgumentError(
        "Solicitation codes outside the range 0-9999 are not allowed"
      )
    );
  }
  return Ok({ prefix, code });
}

@Service([prismaToken])
export class DailyDepartmentNotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async findDDNByUnique(param: UniqueDailyDepartmentNotificationParam): Promise<
    Result<
      DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
        donors: (DDNDonorLink & { donor: DDNDonor })[];
        solicitationCode: SolicitationCode;
      },
      RepositoryError
    >
  > {
    try {
      const row = await this.prisma.dailyDepartmentNotification.findUnique({
        where: param,
        include: {
          batch: true,
          solicitationCode: true,
          donors: {
            include: {
              donor: true,
            },
          },
        },
      });
      if (!row) {
        return Err(new NotFoundError({ what: "DDN" }));
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
        donors: (DDNDonorLink & { donor: DDNDonor })[];
        solicitationCode: SolicitationCode;
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
        include: {
          batch: true,
          donors: {
            include: {
              donor: true,
            },
          },
          solicitationCode: true,
        },
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
  parseDDNInit(
    data: DDNInit
  ): Result<
    Prisma.DailyDepartmentNotificationCreateInput &
      Prisma.DailyDepartmentNotificationUpdateInput,
    InvalidArgumentError
  >;
  parseDDNInit(
    data: Omit<DDNInit, "batchId"> & { batchId?: undefined }
  ): Result<
    Prisma.DailyDepartmentNotificationCreateInput,
    InvalidArgumentError
  >;
  parseDDNInit(
    data: (Omit<DDNInit, "batchId"> & { batchId?: undefined }) | DDNInit
  ): Result<
    | (Prisma.DailyDepartmentNotificationCreateInput &
        Prisma.DailyDepartmentNotificationUpdateInput)
    | Prisma.DailyDepartmentNotificationUpdateInput,
    InvalidArgumentError
  > {
    const {
      accountName,
      accountNumber,
      batchId,
      combinedAmount,
      combinedDonorName,
      combinedDonorSalutation,
      divFirstGift,
      idSorter,
      onlineGift,
      pledgedAmount,
      transactionType,
      ukFirstGift,
      advFeeAmtPhil,
      advFeeAmtUnit,
      advFeeCcPhil,
      advFeeCcUnit,
      advFeeStatus,
      behalfHonorMemorial,
      combinedDonorSort,
      comment,
      department,
      division,
      donor1Amount,
      donor1Constituency,
      donor1Deceased,
      donor1Degrees,
      donor1GiftKey,
      donor1Id,
      donor1Name,
      donor1Pm,
      donor1Relation,
      donor1TitleBar,
      donor2Amount,
      donor2Constituency,
      donor2Deceased,
      donor2Degrees,
      donor2GiftKey,
      donor2Id,
      donor2Name,
      donor2Pm,
      donor2Relation,
      donor2TitleBar,
      effectiveDate,
      gikDescription,
      gikType,
      hcUnit,
      holdingDestination,
      jvDocDate,
      jvDocNum,
      matchingGift,
      pledgedDate,
      processDate,
      sapDocDate,
      sapDocNum,
      secShares,
      secType,
      solicitation,
      transactionDate,
      transmittalSn,
      email,
    } = data;
    const solicitationCode = parseSolicitationCode(data.solicitationCode);
    if (solicitationCode.isErr()) {
      return Err(solicitationCode.error);
    }

    const donors: Prisma.DDNDonorLinkCreateWithoutDdnInput[] = [];
    if (donor1Id) {
      donors.push({
        amount: donor1Amount ?? 0,
        relation: donor1Relation,
        donor: {
          connectOrCreate: {
            where: {
              donorId: donor1Id,
            },
            create: {
              donorId: donor1Id,
              constituency: donor1Constituency,
              deceased: donor1Deceased ?? false,
              giftKey: donor1GiftKey,
              name: donor1Name,
              titleBar: donor1TitleBar,
              degrees: donor1Degrees ? donor1Degrees.split(", ") : [],
              emails: email ? [email] : [],
              pm: donor1Pm,
            },
          },
        },
      });
    }
    if (donor2Id) {
      donors.push({
        amount: donor2Amount ?? 0,
        relation: donor2Relation,
        donor: {
          connectOrCreate: {
            where: {
              donorId: donor2Id,
            },
            create: {
              donorId: donor2Id,
              constituency: donor2Constituency,
              deceased: donor2Deceased ?? false,
              giftKey: donor2GiftKey,
              name: donor2Name,
              titleBar: donor2TitleBar,
              degrees: donor2Degrees ? donor2Degrees.split(", ") : [],
              emails: email ? [email] : [],
              pm: donor2Pm,
            },
          },
        },
      });
    }

    return Ok({
      jvDocDate: jvDocDate && localDateToJs(jvDocDate),
      sapDocDate: sapDocDate && localDateToJs(sapDocDate),
      pledgedDate: pledgedDate && localDateToJs(pledgedDate),
      processDate: processDate && localDateToJs(processDate),
      effectiveDate: effectiveDate && localDateToJs(effectiveDate),
      transactionDate: transactionDate && localDateToJs(transactionDate),

      accountName,
      accountNumber,
      combinedAmount,
      combinedDonorName,
      combinedDonorSalutation,
      divFirstGift,
      idSorter,
      onlineGift,
      pledgedAmount,
      transactionType,
      ukFirstGift,
      advFeeAmtPhil,
      advFeeAmtUnit,
      advFeeCcPhil,
      advFeeCcUnit,
      advFeeStatus,
      behalfHonorMemorial,
      combinedDonorSort,
      comment,
      department,
      division,
      donors: {
        create: donors,
      },
      gikDescription,
      gikType,
      hcUnit,
      holdingDestination,
      jvDocNum,
      matchingGift,
      sapDocNum,
      secShares,
      secType,
      solicitation,
      transmittalSn,
      batch: batchId
        ? {
            connectOrCreate: {
              create: {
                batchId,
              },
              where: { batchId },
            },
          }
        : undefined,
      solicitationCode: {
        connectOrCreate: {
          create: {
            prefix: solicitationCode.value.prefix,
            code: solicitationCode.value.code,
            name: solicitation,
          },
          where: {
            prefix_code: {
              code: solicitationCode.value.code,
              prefix: solicitationCode.value.prefix,
            },
          },
        },
      },
      fundraisingEntry: {
        create: {},
      },
    });
  }

  async createDDN(data: DDNInit): Promise<
    Result<
      DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
        donors: (DDNDonorLink & { donor: DDNDonor })[];
        solicitationCode: SolicitationCode;
      },
      RepositoryError | InvalidArgumentError
    >
  > {
    try {
      return await this.parseDDNInit(data)
        .toAsyncResult()
        .map((data) =>
          this.prisma.dailyDepartmentNotification.create({
            data,
            include: {
              batch: true,
              donors: {
                include: {
                  donor: true,
                },
              },
              solicitationCode: true,
            },
          })
        ).promise;
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
          donors: (DDNDonorLink & { donor: DDNDonor })[];
          solicitationCode: SolicitationCode;
        }
      >,
      RepositoryError | InvalidArgumentError
    >
  > {
    try {
      const solicitationCode = parseSolicitationCode(data.solicitationCode);
      if (solicitationCode.isErr()) {
        return Err(solicitationCode.error);
      }
      return await this.parseDDNInit(data)
        .toAsyncResult()
        .map(async (data) =>
          Some(
            await this.prisma.dailyDepartmentNotification.update({
              where: param,
              data,
              include: {
                batch: true,
                donors: {
                  include: {
                    donor: true,
                  },
                },
                solicitationCode: true,
              },
            })
          )
        ).promise;
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
          donors: (DDNDonorLink & { donor: DDNDonor })[];
          solicitationCode: SolicitationCode;
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
            include: {
              batch: true,
              donors: {
                include: {
                  donor: true,
                },
              },
              solicitationCode: true,
            },
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
        donors: (DDNDonorLink & { donor: DDNDonor })[];
        solicitationCode: SolicitationCode;
      })[],
      RepositoryError | InvalidArgumentError
    >
  > {
    try {
      const solicitationCodes = new Map<
        string,
        { prefix: string; code: number }
      >();

      for (const row of data) {
        const solicitationCode = parseSolicitationCode(row.solicitationCode);
        if (solicitationCode.isErr()) {
          return Err(solicitationCode.error);
        }
        solicitationCodes.set(row.solicitationCode, solicitationCode.value);
      }

      const toLoad = Result.all(data.map((row) => this.parseDDNInit(row)));

      const results = toLoad.toAsyncResult().map((toLoad) =>
        this.prisma.$transaction(
          toLoad.map((row) =>
            this.prisma.dailyDepartmentNotification.upsert({
              where: { idSorter: row.idSorter },
              update: row,
              create: row,
              include: {
                batch: true,
                donors: {
                  include: {
                    donor: true,
                  },
                },
                solicitationCode: true,
              },
            })
          )
        )
      );

      return await results.promise;
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
        return Err(new NotFoundError({ what: "DDN" }));
      }
      return Ok(row.batch);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findBatchByUnique(
    param: UniqueDailyDepartmentNotificationBatchParam
  ): Promise<Result<DailyDepartmentNotificationBatch, RepositoryError>> {
    try {
      const row = await this.prisma.dailyDepartmentNotificationBatch.findUnique(
        {
          where: param,
        }
      );
      if (!row) {
        return Err(new NotFoundError({ what: "Batch" }));
      }
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async deleteDDNBatch(
    param: UniqueDailyDepartmentNotificationBatchParam
  ): Promise<
    Result<Option<DailyDepartmentNotificationBatch>, RepositoryError>
  > {
    try {
      return Ok(
        Some(
          await this.prisma.dailyDepartmentNotificationBatch.delete({
            where: param,
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

  async findDDNsByBatch(
    batchParam: UniqueDailyDepartmentNotificationBatchParam
  ): Promise<
    Result<
      (DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
        donors: (DDNDonorLink & { donor: DDNDonor })[];
        solicitationCode: SolicitationCode;
      })[],
      RepositoryError
    >
  > {
    try {
      const rows = await this.prisma.dailyDepartmentNotification.findMany({
        where: { batch: batchParam },
        include: {
          batch: true,
          donors: {
            include: {
              donor: true,
            },
          },
          solicitationCode: true,
        },
      });

      return Ok(rows);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }
}
