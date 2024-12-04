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
import { Decimal } from "@prisma/client/runtime/library";
import {
  LocalDate,
  localDateToLuxon,
  type SortDirection,
} from "@ukdanceblue/common";
import {
  ActionDeniedError,
  InvalidArgumentError,
  InvariantError,
  LuxonError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { prismaToken } from "#lib/typediTokens.js";
import { UniquePersonParam } from "#repositories/person/PersonRepository.js";
import {
  handleRepositoryError,
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";
import { SolicitationCodeUniqueParam } from "#repositories/solicitationCode/SolicitationCodeRepository.js";

import {
  buildFundraisingEntryOrder,
  buildFundraisingEntryWhere,
} from "./fundraisingEntryRepositoryUtils.js";

const fundraisingEntryBooleanKeys = [] as const;
type FundraisingEntryBooleanKey = (typeof fundraisingEntryBooleanKeys)[number];

const fundraisingEntryDateKeys = [
  "donatedOn",
  "createdAt",
  "updatedAt",
] as const;
type FundraisingEntryDateKey = (typeof fundraisingEntryDateKeys)[number];

const fundraisingEntryIsNullKeys = [] as const;
type FundraisingEntryIsNullKey = (typeof fundraisingEntryIsNullKeys)[number];

const fundraisingEntryNumericKeys = ["amount", "amountUnassigned"] as const;
type FundraisingEntryNumericKey = (typeof fundraisingEntryNumericKeys)[number];

const fundraisingEntryOneOfKeys = ["teamId", "batchType"] as const;
type FundraisingEntryOneOfKey = (typeof fundraisingEntryOneOfKeys)[number];

const fundraisingEntryStringKeys = [
  "donatedTo",
  "donatedBy",
  "solicitationCode",
] as const;
type FundraisingEntryStringKey = (typeof fundraisingEntryStringKeys)[number];

export type FundraisingEntryOrderKeys =
  | "solicitationCode"
  | "teamId"
  | "batchType"
  | "donatedOn"
  | "amount"
  | "amountUnassigned"
  | "donatedTo"
  | "donatedBy"
  | "createdAt"
  | "updatedAt";

export type FundraisingEntryFilters = FilterItems<
  FundraisingEntryBooleanKey,
  FundraisingEntryDateKey,
  FundraisingEntryIsNullKey,
  FundraisingEntryNumericKey,
  FundraisingEntryOneOfKey,
  FundraisingEntryStringKey
>;

export const wideFundraisingEntryInclude = {
  solicitationCodeOverride: true,
} satisfies Prisma.FundraisingEntryWithMetaInclude;

export type WideFundraisingEntryWithMeta = FundraisingEntryWithMeta & {
  solicitationCodeOverride: SolicitationCode | null;
};

export type FundraisingEntryUniqueParam = SimpleUniqueParam;
export type FundraisingAssignmentUniqueParam = SimpleUniqueParam;

@Service([prismaToken])
export class FundraisingEntryRepository {
  constructor(private readonly prisma: PrismaClient) {}

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

  async listEntries(
    {
      filters,
      order,
      skip,
      take,
    }: {
      filters?: readonly FundraisingEntryFilters[] | undefined | null;
      order?:
        | readonly [key: FundraisingEntryOrderKeys, sort: SortDirection][]
        | undefined
        | null;
      skip?: number | undefined | null;
      take?: number | undefined | null;
    },
    limits: {
      onlyAssignedToPerson?: SimpleUniqueParam | undefined | null;
      forTeam?: SimpleUniqueParam | undefined | null;
      solicitationCode?: SolicitationCodeUniqueParam | undefined | null;
    } = {}
  ): Promise<
    Result<
      WideFundraisingEntryWithMeta[],
      | RepositoryError
      | ActionDeniedError
      | InvalidArgumentError
      | InvariantError
    >
  > {
    try {
      const whereResult = buildFundraisingEntryWhere(filters);
      const orderByResult = buildFundraisingEntryOrder(order);
      if (whereResult.isErr()) {
        return whereResult;
      }
      if (orderByResult.isErr()) {
        return orderByResult;
      }
      const where = whereResult.value;
      const orderBy = orderByResult.value;

      if (limits.onlyAssignedToPerson) {
        where.assignments = {
          ...where.assignments,
          every: {
            ...where.assignments?.every,
            person: limits.onlyAssignedToPerson,
          },
        };
      }
      if (limits.forTeam || limits.solicitationCode) {
        let solicitationCodeWhere: Prisma.SolicitationCodeWhereInput;
        if (limits.solicitationCode && !limits.forTeam) {
          solicitationCodeWhere = limits.solicitationCode;
        } else if (!limits.solicitationCode && limits.forTeam) {
          solicitationCodeWhere = {
            teams: {
              some: limits.forTeam,
            },
          };
        } else {
          return Err(
            new InvalidArgumentError(
              "Must provide either forTeam or solicitationCode"
            )
          );
        }
        where.OR = [
          {
            solicitationCodeOverride: solicitationCodeWhere,
          },
          {
            dbFundsEntry: {
              dbFundsTeam: {
                solicitationCode: solicitationCodeWhere,
              },
            },
            solicitationCodeOverride: null,
          },
          {
            ddn: {
              solicitationCode: solicitationCodeWhere,
            },
            solicitationCodeOverride: null,
          },
        ];
      }

      const rows = await this.prisma.fundraisingEntryWithMeta.findMany({
        include: wideFundraisingEntryInclude,
        where,
        orderBy: [orderBy],
        skip: skip ?? undefined,
        take: take ?? undefined,
      });

      return Ok(rows);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
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

  async countEntries(
    {
      filters,
    }: {
      filters?: readonly FundraisingEntryFilters[] | undefined | null;
    },
    limits: {
      onlyAssignedToPerson?: SimpleUniqueParam | undefined | null;
      forTeam?: SimpleUniqueParam | undefined | null;
      solicitationCode?: SolicitationCodeUniqueParam | undefined | null;
    } = {}
  ): Promise<
    Result<number, RepositoryError | ActionDeniedError | InvalidArgumentError>
  > {
    try {
      const whereResult = buildFundraisingEntryWhere(filters);
      if (whereResult.isErr()) {
        return whereResult;
      }
      const where = whereResult.value;

      if (limits.onlyAssignedToPerson) {
        where.assignments = {
          ...where.assignments,
          every: {
            ...where.assignments?.every,
            person: limits.onlyAssignedToPerson,
          },
        };
      }
      if (limits.forTeam || limits.solicitationCode) {
        let solicitationCodeWhere: Prisma.SolicitationCodeWhereInput;
        if (limits.solicitationCode && !limits.forTeam) {
          solicitationCodeWhere = limits.solicitationCode;
        } else if (!limits.solicitationCode && limits.forTeam) {
          solicitationCodeWhere = {
            teams: {
              some: limits.forTeam,
            },
          };
        } else {
          return Err(
            new InvalidArgumentError(
              "Must provide either forTeam or solicitationCode"
            )
          );
        }
        where.OR = [
          {
            solicitationCodeOverride: solicitationCodeWhere,
          },
          {
            dbFundsEntry: {
              dbFundsTeam: {
                solicitationCode: solicitationCodeWhere,
              },
            },
            solicitationCodeOverride: null,
          },
          {
            ddn: {
              solicitationCode: solicitationCodeWhere,
            },
            solicitationCodeOverride: null,
          },
        ];
      }

      return Ok(await this.prisma.fundraisingEntryWithMeta.count({ where }));
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
