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
import type { DefaultArgs } from "@prisma/client/runtime/library";
import {
  DDNInit,
  type FieldsOfListQueryArgs,
  type ListDailyDepartmentNotificationsArgs,
  localDateToJs,
} from "@ukdanceblue/common";
import { InvalidArgumentError, NotFoundError } from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";

import { logger } from "#lib/logging/standardLogging.js";
import { PrismaService } from "#lib/prisma.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";
import { UniquePersonParam } from "#repositories/person/PersonRepository.js";
import {
  type AsyncRepositoryResult,
  handleRepositoryError,
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";

type UniqueDailyDepartmentNotificationParam = SimpleUniqueParam;

type UniqueDailyDepartmentNotificationBatchParam =
  | SimpleUniqueParam
  | {
      batchId: string;
    };

type DailyDepartmentNotificationKeys =
  FieldsOfListQueryArgs<ListDailyDepartmentNotificationsArgs>;

function parseSolicitationCode(
  solicitationCodeString: string
): Result<{ prefix: string; code: number }, InvalidArgumentError> {
  if (solicitationCodeString === "NOCODE") {
    return Ok({
      prefix: "NOCODE",
      code: 0,
    });
  }
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

interface ParsedDDNInit<
  BatchId extends string | undefined = string | undefined,
> {
  ddn: Omit<
    Prisma.DailyDepartmentNotificationCreateInput,
    "solicitationCode" | "batch" | "fundraisingEntry"
  >;
  batchId: BatchId;
  donors: {
    amount: number;
    relation: string | undefined;
    giftKey: string | undefined;
    donor: {
      donorId: string;
      constituency: string | undefined;
      deceased: boolean;
      name: string | undefined;
      titleBar: string | undefined;
      degrees: string[];
      emails: string[];
      pm: string | undefined;
    };
  }[];
  solicitationCode: {
    prefix: string;
    code: number;
  };
  solicitation: string | undefined;
}

const ddnInclude = {
  batch: true,
  solicitationCode: true,
  donors: {
    include: {
      donor: true,
    },
  },
} as const satisfies Prisma.DailyDepartmentNotificationInclude;

@Service([PrismaService])
export class DailyDepartmentNotificationRepository extends buildDefaultRepository<
  PrismaClient["dailyDepartmentNotification"],
  UniqueDailyDepartmentNotificationParam,
  DailyDepartmentNotificationKeys,
  typeof ddnInclude
>("DailyDepartmentNotification", {
  Amount: {
    getOrderBy: (sort) => Ok({ combinedAmount: sort }),
    getWhere: (value) => Ok({ combinedAmount: value }),
  },
  BatchType: {
    getOrderBy: () => Err(new InvalidArgumentError("BatchType not supported")),
    getWhere: () => Err(new InvalidArgumentError("BatchType not supported")),
  },
  Comment: {
    getOrderBy: (sort) => Ok({ comment: sort }),
    getWhere: (value) => Ok({ comment: value }),
    searchable: true,
  },
  Donor: {
    getOrderBy: (sort) => Ok({ combinedDonorSort: sort }),
    getWhere: (value) => Ok({ combinedDonorName: value }),
    searchable: true,
  },
  SolicitationCodeName: {
    getOrderBy: (sort) => Ok({ solicitationCode: { name: sort } }),
    getWhere: (value) => Ok({ solicitationCode: { name: value } }),
  },
  SolicitationCodeNumber: {
    getOrderBy: (sort) => Ok({ solicitationCode: { code: sort } }),
    getWhere: (value) => Ok({ solicitationCode: { code: value } }),
  },
  SolicitationCodePrefix: {
    getOrderBy: (sort) => Ok({ solicitationCode: { prefix: sort } }),
    getWhere: (value) => Ok({ solicitationCode: { prefix: value } }),
  },
  createdAt: {
    getOrderBy: (sort) => Ok({ createdAt: sort }),
    getWhere: (value) => Ok({ createdAt: value }),
  },
  get combinedDonorName() {
    return this.Donor;
  },
  get batch() {
    return this.BatchType;
  },
  get combinedAmount() {
    return this.Amount;
  },
  get comment() {
    return this.Comment;
  },
  solicitationCode: {
    getOrderBy: (sort) => Ok({ solicitationCode: { text: sort } }),
    getWhere: (value) => Ok({ solicitationCode: { text: value } }),
    searchable: true,
  },
}) {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  public uniqueToWhere(
    by: SimpleUniqueParam
  ): Prisma.DailyDepartmentNotificationWhereUniqueInput {
    return DailyDepartmentNotificationRepository.simpleUniqueToWhere(by);
  }

  async findDDNByUnique(param: UniqueDailyDepartmentNotificationParam): Promise<
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
      const row = await this.prisma.dailyDepartmentNotification.findUnique({
        where: param,
        include: ddnInclude,
      });
      if (!row) {
        return Ok(None);
      }
      return Ok(Some(row));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<DailyDepartmentNotificationKeys>): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.DailyDepartmentNotificationDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      {
        include: {
          readonly batch: true;
          readonly solicitationCode: true;
          readonly donors: { readonly include: { readonly donor: true } };
        };
      }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).dailyDepartmentNotification.findMany({
            ...params,
            include: ddnInclude,
          })
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).dailyDepartmentNotification.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
  }

  parseDDNInit(
    data: Omit<DDNInit, "batchId"> & { batchId?: undefined }
  ): Result<ParsedDDNInit<undefined>, InvalidArgumentError>;
  parseDDNInit(
    data: DDNInit
  ): Result<ParsedDDNInit<string>, InvalidArgumentError>;
  parseDDNInit(
    data: (Omit<DDNInit, "batchId"> & { batchId?: undefined }) | DDNInit
  ): Result<ParsedDDNInit, InvalidArgumentError> {
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

    const donors: ParsedDDNInit["donors"] = [];
    let donorSummary = comment ?? "";
    if (donor1Id) {
      donors.push({
        amount: donor1Amount ?? 0,
        relation: donor1Relation,
        giftKey: donor1GiftKey,
        donor: {
          donorId: donor1Id,
          constituency: donor1Constituency,
          deceased: donor1Deceased ?? false,
          name: donor1Name,
          titleBar: donor1TitleBar,
          degrees: donor1Degrees ? donor1Degrees.split(", ") : [],
          emails: email ? [email] : [],
          pm: donor1Pm,
        },
      });
      donorSummary += `${donor1Id}-${donor1GiftKey}`;
    }
    if (donor2Id) {
      donors.push({
        amount: donor2Amount ?? 0,
        relation: donor2Relation,
        giftKey: donor2GiftKey,
        donor: {
          donorId: donor2Id,
          constituency: donor2Constituency,
          deceased: donor2Deceased ?? false,
          name: donor2Name,
          titleBar: donor2TitleBar,
          degrees: donor2Degrees ? donor2Degrees.split(", ") : [],
          emails: email ? [email] : [],
          pm: donor2Pm,
        },
      });
      donorSummary += `${donor2Id}-${donor2GiftKey}`;
    }

    return Ok({
      ddn: {
        jvDocDate: jvDocDate && localDateToJs(jvDocDate),
        sapDocDate: sapDocDate && localDateToJs(sapDocDate),
        pledgedDate: pledgedDate && localDateToJs(pledgedDate),
        processDate: localDateToJs(processDate),
        effectiveDate: effectiveDate && localDateToJs(effectiveDate),
        transactionDate: transactionDate && localDateToJs(transactionDate),

        donorSummary,

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
      },
      batchId,
      solicitationCode: {
        prefix: solicitationCode.value.prefix,
        code: solicitationCode.value.code,
      },
      solicitation,
      donors,
    });
  }

  async createDDN(
    data: DDNInit,
    {
      enteredBy,
    }: {
      enteredBy: UniquePersonParam | null;
    }
  ): Promise<
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
            data: {
              ...data.ddn,
              batch: {
                connectOrCreate: {
                  create: {
                    batchId: data.batchId,
                  },
                  where: { batchId: data.batchId },
                },
              },
              solicitationCode: {
                connectOrCreate: {
                  create: {
                    prefix: data.solicitationCode.prefix,
                    code: data.solicitationCode.code,
                    name: data.solicitation,
                  },
                  where: {
                    prefix_code: {
                      code: data.solicitationCode.code,
                      prefix: data.solicitationCode.prefix,
                    },
                  },
                },
              },
              donors: {
                create: data.donors.map((donor) => ({
                  amount: donor.amount,
                  relation: donor.relation,
                  donor: {
                    connectOrCreate: {
                      create: donor.donor,
                      where: { donorId: donor.donor.donorId },
                    },
                  },
                })),
              },
              fundraisingEntry: {
                create: {
                  enteredByPerson: enteredBy
                    ? {
                        connect: enteredBy,
                      }
                    : undefined,
                },
              },
            },
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
      DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
        donors: (DDNDonorLink & { donor: DDNDonor })[];
        solicitationCode: SolicitationCode;
      },
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
        .map((data) =>
          this.prisma.dailyDepartmentNotification.update({
            where: param,
            data: {
              ...data.ddn,
              solicitationCode: {
                upsert: {
                  create: {
                    prefix: data.solicitationCode.prefix,
                    code: data.solicitationCode.code,
                    name: data.solicitation,
                  },
                  where: {
                    code: data.solicitationCode.code,
                    prefix: data.solicitationCode.prefix,
                  },
                  update: {
                    name: data.solicitation,
                  },
                },
              },
              donors: {
                create: data.donors.map((donor) => ({
                  amount: donor.amount,
                  relation: donor.relation,
                  donor: {
                    connectOrCreate: {
                      create: donor.donor,
                      where: { donorId: donor.donor.donorId },
                    },
                  },
                })),
              },
            },
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError("DDN"));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async deleteDDN(param: UniqueDailyDepartmentNotificationParam): Promise<
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
      return Ok(
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
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError("DDN"));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async batchLoadDDNs(
    data: DDNInit[],
    {
      enteredBy,
    }: {
      enteredBy: UniquePersonParam | null;
    }
  ): Promise<
    Result<
      (DailyDepartmentNotification & {
        batch: DailyDepartmentNotificationBatch;
        donors: (DDNDonorLink & { donor: DDNDonor })[];
        solicitationCode: SolicitationCode;
      })[],
      RepositoryError | InvalidArgumentError
    >
  > {
    logger.debug("Loading DDNs in batch");
    try {
      const toLoad = Result.all(data.map((row) => this.parseDDNInit(row)));
      // This is a safety mechanism to make sure we don't treat two rows with the same properties as the same row
      const uniqueDDns = new Set<string>();

      return await toLoad.toAsyncResult().andThen((toLoad) =>
        this.handleTransactionError(async (prisma) => {
          const results = [];
          const batches = new Map<string, DailyDepartmentNotificationBatch>();

          for (const row of toLoad) {
            logger.trace("Loading DDN");
            const donors = new Map<string, DDNDonor>();
            for (const donor of row.donors) {
              logger.trace("Loading donor", { donorId: donor.donor.donorId });
              donors.set(
                donor.donor.donorId,
                // eslint-disable-next-line no-await-in-loop
                await prisma.dDNDonor.upsert({
                  where: {
                    donorId: donor.donor.donorId,
                  },
                  update: {
                    ...donor.donor,
                  },
                  create: {
                    ...donor.donor,
                  },
                })
              );
            }
            logger.trace("Loading solicitation code", {
              prefix: row.solicitationCode.prefix,
              code: row.solicitationCode.code,
            });
            // eslint-disable-next-line no-await-in-loop
            const solicitationCode = await prisma.solicitationCode.upsert({
              where: {
                prefix_code: {
                  prefix: row.solicitationCode.prefix,
                  code: row.solicitationCode.code,
                },
              },
              update: {
                name: row.solicitation,
              },
              create: {
                prefix: row.solicitationCode.prefix,
                code: row.solicitationCode.code,
                name: row.solicitation,
              },
            });
            let batch = batches.get(row.batchId);
            if (!batch) {
              logger.trace("Creating batch", { batchId: row.batchId });
              // eslint-disable-next-line no-await-in-loop
              batch = await prisma.dailyDepartmentNotificationBatch.upsert({
                where: {
                  batchId: row.batchId,
                },
                update: {},
                create: {
                  batchId: row.batchId,
                },
              });
              batches.set(row.batchId, batch);
            } else {
              logger.trace("Batch already exists", { batchId: row.batchId });
            }

            const uniques = {
              idSorter: row.ddn.idSorter,
              processDate: row.ddn.processDate,
              batchId: batch.id,
              solicitationCodeId: solicitationCode.id,
              combinedAmount: row.ddn.combinedAmount,
              donorSummary: row.ddn.donorSummary,
            };
            const uniqueStr = `${
              uniques.idSorter
            }-${uniques.processDate.toString()}-${uniques.batchId}-${
              uniques.solicitationCodeId
            }-$${uniques.combinedAmount.toString()}-${uniques.donorSummary}`;
            if (uniqueDDns.has(uniqueStr)) {
              return Err(
                new InvalidArgumentError(
                  `Cannot determine the difference between two rows: ${uniqueStr}`
                )
              );
            }
            uniqueDDns.add(uniqueStr);
            logger.trace("Creating DDN", { uniqueStr });

            results.push(
              // eslint-disable-next-line no-await-in-loop
              await prisma.dailyDepartmentNotification.upsert({
                where: {
                  idSorter_processDate_batchId_solicitationCodeId_combinedAmount_donorSummary:
                    uniques,
                },
                create: {
                  ...row.ddn,
                  solicitationCode: {
                    connect: {
                      id: solicitationCode.id,
                    },
                  },
                  batch: {
                    connect: {
                      id: batch.id,
                    },
                  },
                  donors: {
                    create: row.donors.map((donor) => ({
                      amount: donor.amount,
                      relation: donor.relation,
                      donor: {
                        connect: {
                          id: donors.get(donor.donor.donorId)!.id,
                        },
                      },
                    })),
                  },
                  fundraisingEntry: {
                    create: {
                      enteredByPerson: enteredBy
                        ? {
                            connect: enteredBy,
                          }
                        : undefined,
                    },
                  },
                },
                update: {
                  ...row.ddn,
                  solicitationCode: {
                    connect: {
                      id: solicitationCode.id,
                    },
                  },
                  batch: {
                    connect: {
                      id: batch.id,
                    },
                  },
                  donors: {
                    deleteMany: {},
                    create: row.donors.map((donor) => ({
                      amount: donor.amount,
                      relation: donor.relation,
                      donor: {
                        connect: {
                          id: donors.get(donor.donor.donorId)!.id,
                        },
                      },
                    })),
                  },
                },
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
            );
          }
          return Ok(results);
        })
      ).promise;
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
        return Err(new NotFoundError("DDN"));
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
        return Err(new NotFoundError("Batch"));
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
