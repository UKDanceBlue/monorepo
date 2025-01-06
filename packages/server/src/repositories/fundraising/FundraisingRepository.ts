import { Service } from "@freshgum/typedi";
import {
  BatchType,
  DailyDepartmentNotification,
  DailyDepartmentNotificationBatch,
  DDNDonor,
  DDNDonorLink,
  FundraisingAssignment,
  FundraisingEntry,
  FundraisingEntryWithMeta,
  Membership,
  Person,
  Prisma,
  PrismaClient,
  SolicitationCode,
  Team,
} from "@prisma/client";
import { Decimal, type DefaultArgs } from "@prisma/client/runtime/library";
import {
  type FieldsOfListQueryArgs,
  type ListFundraisingEntriesArgs,
  LocalDate,
  localDateToLuxon,
} from "@ukdanceblue/common";
import {
  ActionDeniedError,
  InvariantError,
  LuxonError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";

import { prismaToken } from "#lib/typediTokens.js";
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
import { SolicitationCodeUniqueParam } from "#repositories/solicitationCode/SolicitationCodeRepository.js";

export const wideFundraisingEntryInclude = {
  solicitationCodeOverride: true,
} satisfies Prisma.FundraisingEntryWithMetaInclude;

export type WideFundraisingEntryWithMeta = FundraisingEntryWithMeta & {
  solicitationCodeOverride: SolicitationCode | null;
};

export type FundraisingEntryUniqueParam = SimpleUniqueParam;
export type FundraisingAssignmentUniqueParam = SimpleUniqueParam;

@Service([prismaToken])
export class FundraisingEntryRepository extends buildDefaultRepository<
  PrismaClient["fundraisingEntryWithMeta"],
  FundraisingEntryUniqueParam,
  FieldsOfListQueryArgs<ListFundraisingEntriesArgs>,
  typeof wideFundraisingEntryInclude
>("FundraisingEntry", {
  amount: {
    getOrderBy: (dir) => Ok({ amount: dir }),
    getWhere: (value) => Ok({ amount: value }),
  },
  amountUnassigned: {
    getOrderBy: (dir) => Ok({ unassigned: dir }),
    getWhere: (value) => Ok({ unassigned: value }),
  },
  batchType: {
    getOrderBy: (dir) => Ok({ batchType: dir }),
    getWhere: (value) => Ok({ batchType: value }),
  },
  donatedBy: {
    getOrderBy: (dir) => Ok({ donatedBy: dir }),
    getWhere: (value) => Ok({ donatedBy: value }),
    searchable: true,
  },
  donatedOn: {
    getOrderBy: (dir) => Ok({ donatedOn: dir }),
    getWhere: (value) => Ok({ donatedOn: value }),
  },
  donatedTo: {
    getOrderBy: (dir) => Ok({ donatedTo: dir }),
    getWhere: (value) => Ok({ donatedTo: value }),
    searchable: true,
  },
  solicitationCode: {
    getOrderBy: (dir) => Ok({ solicitationCodeText: dir }),
    getWhere: (value) => Ok({ solicitationCodeText: value }),
  },
  createdAt: {
    getOrderBy: (dir) => Ok({ createdAt: dir }),
    getWhere: (value) => Ok({ createdAt: value }),
  },
  updatedAt: {
    getOrderBy: (dir) => Ok({ updatedAt: dir }),
    getWhere: (value) => Ok({ updatedAt: value }),
  },
}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(
    by: FundraisingEntryUniqueParam
  ): Prisma.FundraisingEntryWithMetaWhereUniqueInput {
    return FundraisingEntryRepository.simpleUniqueToWhere(by);
  }

  async findEntryByUnique(
    param: FundraisingEntryUniqueParam
  ): Promise<
    Result<WideFundraisingEntryWithMeta, RepositoryError | InvariantError>
  > {
    try {
      const row = await this.prisma.fundraisingEntryWithMeta.findUnique({
        where: param,
        include: wideFundraisingEntryInclude,
      });
      if (!row) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      return Ok(row);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async findAssignmentByUnique(
    param: FundraisingAssignmentUniqueParam
  ): Promise<Result<FundraisingAssignment, RepositoryError>> {
    try {
      const row = await this.prisma.fundraisingAssignment.findUnique({
        where: param,
      });
      if (!row) {
        return Err(new NotFoundError({ what: "FundraisingAssignment" }));
      }
      return Ok(row);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getAssignmentsForEntry(
    param: FundraisingEntryUniqueParam
  ): Promise<Result<readonly FundraisingAssignment[], RepositoryError>> {
    try {
      const entry = await this.prisma.fundraisingEntryWithMeta.findUnique({
        where: param,
        select: { assignments: true },
      });
      if (!entry) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      return Ok(entry.assignments);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  findAndCount({
    tx,
    forTeam,
    onlyAssignedToPerson,
    solicitationCode,
    ...params
  }: FindAndCountParams<FieldsOfListQueryArgs<ListFundraisingEntriesArgs>> & {
    onlyAssignedToPerson?: SimpleUniqueParam | undefined | null;
    forTeam?: SimpleUniqueParam | undefined | null;
    solicitationCode?: SolicitationCodeUniqueParam | undefined | null;
  }): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.FundraisingEntryWithMetaDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      { include: { solicitationCodeOverride: true } }
    >
  > {
    const where: Prisma.FundraisingEntryWithMetaWhereInput[] = [];
    if (onlyAssignedToPerson) {
      where.push({
        assignments: {
          every: {
            person: onlyAssignedToPerson,
          },
        },
      });
    }
    if (forTeam || solicitationCode) {
      const solicitationCodeWhere: Prisma.SolicitationCodeWhereInput[] = [];
      if (solicitationCode) {
        solicitationCodeWhere.push(solicitationCode);
      }
      if (forTeam) {
        solicitationCodeWhere.push({
          teams: {
            some: forTeam,
          },
        });
      }

      where.push({
        OR: [
          {
            AND: [
              { solicitationCodeOverrideId: null },
              {
                OR: [
                  {
                    dbFundsEntry: {
                      dbFundsTeam: {
                        solicitationCode: {
                          AND: solicitationCodeWhere,
                        },
                      },
                    },
                  },
                  {
                    ddn: {
                      solicitationCode: {
                        AND: solicitationCodeWhere,
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            solicitationCodeOverride: {
              AND: solicitationCodeWhere,
            },
          },
        ],
      });
    }
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).fundraisingEntryWithMeta.findMany({
            ...params,
            include: wideFundraisingEntryInclude,
          })
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).fundraisingEntryWithMeta.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
  }

  async setEntry(
    param: FundraisingEntryUniqueParam,
    {
      notes,
      amountOverride,
      batchTypeOverride,
      donatedByOverride,
      donatedOnOverride,
      donatedToOverride,
      solicitationCodeOverride,
    }: {
      notes: string | null;
      amountOverride: number | null;
      batchTypeOverride: BatchType | null;
      donatedByOverride: string | null;
      donatedOnOverride: Date | LocalDate | null;
      donatedToOverride: string | null;
      solicitationCodeOverride: SolicitationCodeUniqueParam | null;
    }
  ): Promise<
    Result<
      WideFundraisingEntryWithMeta,
      | RepositoryError
      | InvariantError
      | NotFoundError
      | ActionDeniedError
      | LuxonError
    >
  > {
    try {
      const entry = await this.prisma.fundraisingEntryWithMeta.findUnique({
        where: param,
      });
      if (!entry) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }

      await this.prisma.fundraisingEntry.update({
        where: param,
        data: {
          notes,
          amountOverride,
          batchTypeOverride,
          donatedByOverride,
          donatedOnOverride:
            typeof donatedOnOverride === "string"
              ? // I don't know why we need to add a day here but oh well, something to do with how prisma consumes the zone i think
                localDateToLuxon(donatedOnOverride)
                  .unwrap()
                  .plus({ day: 1 })
                  .toJSDate()
              : donatedOnOverride,
          donatedToOverride,
          solicitationCodeOverride: solicitationCodeOverride
            ? {
                connect:
                  "code" in solicitationCodeOverride
                    ? { prefix_code: solicitationCodeOverride }
                    : solicitationCodeOverride,
              }
            : { disconnect: true },
        },
      });

      const updatedEntry =
        await this.prisma.fundraisingEntryWithMeta.findUnique({
          where: param,
          include: wideFundraisingEntryInclude,
        });

      if (!updatedEntry) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }

      return Ok(updatedEntry);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async deleteEntry(
    param: FundraisingEntryUniqueParam
  ): Promise<Result<Option<FundraisingEntry>, RepositoryError>> {
    try {
      return Ok(
        Some(await this.prisma.fundraisingEntry.delete({ where: param }))
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

  async addAssignmentToEntry(
    entryParam: FundraisingEntryUniqueParam,
    personParam: SimpleUniqueParam,
    { amount }: { amount: number }
  ): Promise<
    Result<
      FundraisingAssignment,
      RepositoryError | ActionDeniedError | InvariantError
    >
  > {
    if (amount < 0) {
      return Err(new ActionDeniedError("Amount must be non-negative"));
    }

    try {
      const entry = await this.findEntryByUnique(entryParam);
      if (entry.isErr()) {
        return Err(entry.error);
      }
      const assignments = await this.getAssignmentsForEntry(entryParam);
      if (assignments.isErr()) {
        return Err(assignments.error);
      }

      const totalAssigned = assignments.value.reduce(
        (acc, assignment) => acc.add(assignment.amount),
        new Prisma.Decimal(0)
      );

      if (
        (entry.value.amount ?? new Decimal(0)).lessThan(
          totalAssigned.add(amount)
        )
      ) {
        return Err(
          new ActionDeniedError("Total assigned amount exceeds entry amount")
        );
      }

      return Ok(
        await this.prisma.fundraisingAssignment.create({
          data: {
            amount,
            parentEntry: { connect: entryParam },
            person: { connect: personParam },
          },
        })
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async deleteAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<Result<FundraisingAssignment, RepositoryError>> {
    try {
      return Ok(
        await this.prisma.fundraisingAssignment.delete({
          where: assignmentParam,
        })
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async updateAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam,
    { amount }: { amount: number }
  ): Promise<
    Result<FundraisingAssignment, RepositoryError | ActionDeniedError>
  > {
    if (amount < 0) {
      return Err(new ActionDeniedError("Amount must be non-negative"));
    }

    try {
      const assignment = await this.prisma.fundraisingAssignment.findUnique({
        where: assignmentParam,
        select: {
          id: true,
          parentEntry: {
            select: {
              ddn: { select: { combinedAmount: true } },
              dbFundsEntry: { select: { amount: true } },
              id: true,
            },
          },
        },
      });
      if (!assignment) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      const assignments = await this.getAssignmentsForEntry({
        id: assignment.parentEntry.id,
      });
      if (assignments.isErr()) {
        return Err(assignments.error);
      }

      const totalAssigned = assignments.value
        .filter((a) => a.id !== assignment.id)
        .reduce(
          (acc, assignment) => acc.add(assignment.amount),
          new Prisma.Decimal(0)
        );

      let entryAmount: Decimal;
      if (assignment.parentEntry.ddn) {
        entryAmount = assignment.parentEntry.ddn.combinedAmount;
      } else if (assignment.parentEntry.dbFundsEntry) {
        entryAmount = assignment.parentEntry.dbFundsEntry.amount;
      } else {
        return Err(new NotFoundError({ what: "FundraisingEntrySource" }));
      }
      if (entryAmount.lessThan(totalAssigned.add(amount))) {
        return Err(
          new ActionDeniedError("Total assigned amount exceeds entry amount")
        );
      }

      return Ok(
        await this.prisma.fundraisingAssignment.update({
          where: assignmentParam,
          data: { amount },
        })
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getPersonForAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<Result<Person, RepositoryError>> {
    try {
      const assignment = await this.prisma.fundraisingAssignment.findUnique({
        where: assignmentParam,
        select: { person: true },
      });
      if (!assignment) {
        return Err(new NotFoundError({ what: "FundraisingAssignment" }));
      }
      return Ok(assignment.person);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getMembershipForAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<
    Result<
      Membership & {
        team: Team;
        person: Person;
      },
      RepositoryError
    >
  > {
    try {
      const assignment = await this.prisma.fundraisingAssignment.findUnique({
        where: assignmentParam,
        select: {
          person: true,
          parentEntry: {
            select: {
              solicitationCodeOverride: {
                select: { teams: { select: { id: true } } },
              },
              ddn: {
                select: {
                  solicitationCode: {
                    select: { teams: { select: { id: true } } },
                  },
                  batch: true,
                },
              },
              dbFundsEntry: {
                select: {
                  dbFundsTeam: {
                    select: {
                      solicitationCode: {
                        select: { teams: { select: { id: true } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!assignment) {
        return Err(new NotFoundError({ what: "FundraisingAssignment" }));
      }

      const teams =
        assignment.parentEntry.solicitationCodeOverride?.teams ??
        assignment.parentEntry.ddn?.solicitationCode.teams ??
        assignment.parentEntry.dbFundsEntry?.dbFundsTeam.solicitationCode
          .teams ??
        [];

      const result = await this.prisma.membership.findFirst({
        where: {
          person: assignment.person,
          teamId: {
            in: teams.map((t) => t.id),
          },
        },
        include: { team: true, person: true },
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!result || !result.team || !result.person) {
        return Err(new NotFoundError({ what: "Membership" }));
      }

      return Ok(result);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getEntryForAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<
    Result<WideFundraisingEntryWithMeta, RepositoryError | InvariantError>
  > {
    try {
      const assignment = await this.prisma.fundraisingAssignment.findUnique({
        where: assignmentParam,
        select: {
          parentEntryWithMeta: {
            include: wideFundraisingEntryInclude,
          },
        },
      });
      if (!assignment) {
        return Err(new NotFoundError({ what: "FundraisingAssignment" }));
      }
      return Ok(assignment.parentEntryWithMeta!);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getAssignmentsForPerson(
    personParam: UniquePersonParam
  ): Promise<Result<readonly FundraisingAssignment[], RepositoryError>> {
    try {
      const assignments = await this.prisma.fundraisingAssignment.findMany({
        where: { person: personParam },
      });
      return Ok(assignments);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getDdnForEntry(entryParam: FundraisingEntryUniqueParam): Promise<
    Result<
      Option<
        DailyDepartmentNotification & {
          batch: DailyDepartmentNotificationBatch;
          donors: (DDNDonorLink & { donor: DDNDonor })[];
          solicitationCode: SolicitationCode;
        }
      >,
      RepositoryError | ActionDeniedError | InvariantError | NotFoundError
    >
  > {
    try {
      const entry = await this.prisma.fundraisingEntryWithMeta.findUnique({
        where: entryParam,
        include: {
          ddn: {
            include: {
              batch: true,
              donors: {
                include: {
                  donor: true,
                },
              },
              solicitationCode: true,
            },
          },
        },
      });
      if (!entry) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      if (!entry.ddn) {
        return Ok(None);
      }
      return Ok(Some(entry.ddn));
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }
}
