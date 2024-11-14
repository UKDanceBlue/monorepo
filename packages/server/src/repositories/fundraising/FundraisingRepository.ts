import { Service } from "@freshgum/typedi";
import {
  DailyDepartmentNotification,
  DailyDepartmentNotificationBatch,
  DBFundsFundraisingEntry,
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
import type { SortDirection } from "@ukdanceblue/common";
import {
  ActionDeniedError,
  InvalidArgumentError,
  InvariantError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { UniquePersonParam } from "#repositories/person/PersonRepository.js";
import {
  handleRepositoryError,
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";

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

const fundraisingEntryOneOfKeys = ["teamId"] as const;
type FundraisingEntryOneOfKey = (typeof fundraisingEntryOneOfKeys)[number];

const fundraisingEntryStringKeys = ["donatedTo", "donatedBy"] as const;
type FundraisingEntryStringKey = (typeof fundraisingEntryStringKeys)[number];

export type FundraisingEntryOrderKeys =
  | "teamId"
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

const defaultInclude = {
  entrySource: {
    select: {
      ddn: {
        include: {
          batch: true,
          solicitationCode: true,
        },
      },
      dbFundsEntry: true,
    },
  },
} satisfies Prisma.FundraisingEntryWithMetaInclude;

export type WideFundraisingEntryWithMeta = FundraisingEntryWithMeta & {
  entrySource:
    | {
        ddn: DailyDepartmentNotification & {
          batch: DailyDepartmentNotificationBatch;
          solicitationCode: SolicitationCode;
        };
      }
    | {
        dbFundsEntry: DBFundsFundraisingEntry;
      }
    | null;
};

function asWideFundraisingEntryWithMeta(
  entry: FundraisingEntryWithMeta & {
    entrySource: {
      ddn:
        | (DailyDepartmentNotification & {
            batch: DailyDepartmentNotificationBatch;
            solicitationCode: SolicitationCode;
          })
        | null;
      dbFundsEntry: DBFundsFundraisingEntry | null;
    } | null;
  }
): Result<WideFundraisingEntryWithMeta, InvariantError> {
  if (!entry.entrySource) {
    return Err(new InvariantError("Fundraising entry source is missing"));
  }
  if (entry.entrySource.ddn && entry.entrySource.dbFundsEntry) {
    return Err(new InvariantError("Fundraising entry has multiple sources"));
  }
  if (entry.entrySource.ddn) {
    return Ok({ ...entry, entrySource: { ddn: entry.entrySource.ddn } });
  }
  if (entry.entrySource.dbFundsEntry) {
    return Ok({
      ...entry,
      entrySource: { dbFundsEntry: entry.entrySource.dbFundsEntry },
    });
  }
  return Ok({ ...entry, entrySource: null });
}

export type FundraisingEntryUniqueParam = SimpleUniqueParam;
export type FundraisingAssignmentUniqueParam = SimpleUniqueParam;

import { Decimal } from "@prisma/client/runtime/library";

import { prismaToken } from "#prisma";

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
        include: defaultInclude,
      });
      if (!row) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      return asWideFundraisingEntryWithMeta(row);
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
      assignedToPerson?: SimpleUniqueParam | undefined | null;
      forTeam?: SimpleUniqueParam | undefined | null;
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
        return Err(whereResult.error);
      }
      if (orderByResult.isErr()) {
        return Err(orderByResult.error);
      }
      const where = whereResult.value;
      const orderBy = orderByResult.value;

      if (limits.assignedToPerson) {
        where.assignments = {
          ...where.assignments,
          every: {
            ...where.assignments?.every,
            person: limits.assignedToPerson,
          },
        };
      }
      if (limits.forTeam) {
        where.OR = [
          {
            entrySource: {
              dbFundsEntry: {
                dbFundsTeam: {
                  solicitationCode: {
                    teams: {
                      some: limits.forTeam,
                    },
                  },
                } satisfies Prisma.DBFundsTeamWhereInput,
              },
            },
          },
          {
            entrySource: {
              ddn: {
                solicitationCode: {
                  teams: {
                    some: limits.forTeam,
                  },
                },
              },
            },
          },
          {
            teamOverride: limits.forTeam,
          },
        ];
      }

      const rows = await this.prisma.fundraisingEntryWithMeta.findMany({
        include: defaultInclude,
        where,
        orderBy,
        skip: skip ?? undefined,
        take: take ?? undefined,
      });

      return Result.all(rows.map(asWideFundraisingEntryWithMeta));
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
      assignedToPerson?: SimpleUniqueParam | undefined | null;
      forTeam?: SimpleUniqueParam | undefined | null;
    } = {}
  ): Promise<
    Result<number, RepositoryError | ActionDeniedError | InvalidArgumentError>
  > {
    try {
      const where = buildFundraisingEntryWhere(filters);
      if (where.isErr()) {
        return Err(where.error);
      }

      if (limits.forTeam) {
        where.value.entrySource = {
          ...where.value.entrySource,
          // @ts-expect-error This is because the spread technically could include incompatible queries, but we know it doesn't
          OR: [
            {
              dbFundsEntry: {
                dbFundsTeam: {
                  solicitationCode: {
                    teams: {
                      some: limits.forTeam,
                    },
                  },
                },
              },
            },
            {
              ddn: {
                solicitationCode: {
                  teams: {
                    some: limits.forTeam,
                  },
                },
              },
            },
            {
              entryWithMeta: {
                teamOverride: limits.forTeam,
              },
            },
          ],
        };
      }

      return Ok(
        await this.prisma.fundraisingEntryWithMeta.count({ where: where.value })
      );
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
      if (entry.value.entrySource == null) {
        return Err(new NotFoundError({ what: "FundraisingEntrySource" }));
      }

      const totalAssigned = assignments.value.reduce(
        (acc, assignment) => acc.add(assignment.amount),
        new Prisma.Decimal(0)
      );
      let entryAmount: Decimal;
      if ("ddn" in entry.value.entrySource) {
        entryAmount = entry.value.entrySource.ddn.combinedAmount;
      } else if ("dbFundsEntry" in entry.value.entrySource) {
        entryAmount = entry.value.entrySource.dbFundsEntry.amount;
      } else {
        entry.value.entrySource satisfies never;
        return Err(new InvariantError("Unexpected entry source type"));
      }

      if (entryAmount.lessThan(totalAssigned.add(amount))) {
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
              entrySource: {
                select: {
                  ddn: { select: { combinedAmount: true } },
                  dbFundsEntry: { select: { amount: true } },
                },
              },
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
      if (!assignment.parentEntry.entrySource) {
        return Err(new NotFoundError({ what: "FundraisingEntrySource" }));
      } else if (assignment.parentEntry.entrySource.ddn) {
        entryAmount = assignment.parentEntry.entrySource.ddn.combinedAmount;
      } else if (assignment.parentEntry.entrySource.dbFundsEntry) {
        entryAmount = assignment.parentEntry.entrySource.dbFundsEntry.amount;
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
              teamOverride: { select: { id: true } },
              entrySource: {
                select: {
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
                  ddn: {
                    select: {
                      solicitationCode: {
                        select: {
                          teams: { select: { id: true } },
                        },
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

      let teams: { id: number }[];
      if (assignment.parentEntry.teamOverride) {
        teams = [{ id: assignment.parentEntry.teamOverride.id }];
      } else if (assignment.parentEntry.entrySource?.ddn) {
        teams = assignment.parentEntry.entrySource.ddn.solicitationCode.teams;
      } else if (assignment.parentEntry.entrySource?.dbFundsEntry) {
        teams =
          assignment.parentEntry.entrySource.dbFundsEntry.dbFundsTeam
            .solicitationCode.teams;
      } else {
        return Err(new NotFoundError({ what: "FundraisingEntrySource" }));
      }

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
          parentEntry: {
            include: defaultInclude,
          },
        },
      });
      if (!assignment) {
        return Err(new NotFoundError({ what: "FundraisingAssignment" }));
      }
      return asWideFundraisingEntryWithMeta(assignment.parentEntry);
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

  async getSolicitationCodeForEntry(
    entryParam: FundraisingEntryUniqueParam,
    includeTeams?: false
  ): Promise<
    Result<
      SolicitationCode,
      RepositoryError | ActionDeniedError | InvariantError | NotFoundError
    >
  >;
  async getSolicitationCodeForEntry(
    entryParam: FundraisingEntryUniqueParam,
    includeTeams: true
  ): Promise<
    Result<
      SolicitationCode & { teams: readonly Team[] },
      RepositoryError | ActionDeniedError | InvariantError | NotFoundError
    >
  >;
  async getSolicitationCodeForEntry(
    entryParam: FundraisingEntryUniqueParam,
    includeTeams?: boolean
  ): Promise<
    Result<
      SolicitationCode | (SolicitationCode & { teams: readonly Team[] }),
      RepositoryError | ActionDeniedError | InvariantError | NotFoundError
    >
  > {
    try {
      const entry = await this.prisma.fundraisingEntryWithMeta.findUnique({
        where: entryParam,
        include: {
          teamOverride: { include: { solicitationCode: true } },
          entrySource: {
            select: {
              ddn: {
                include: {
                  batch: true,
                  solicitationCode: includeTeams
                    ? { include: { teams: true } }
                    : true,
                },
              },
              dbFundsEntry: {
                include: {
                  dbFundsTeam: {
                    include: {
                      solicitationCode: includeTeams
                        ? { include: { teams: true } }
                        : true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!entry) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }

      if (entry.teamOverride) {
        if (!entry.teamOverride.solicitationCode) {
          return Err(new NotFoundError({ what: "SolicitationCode" }));
        }
        return Ok(
          includeTeams
            ? {
                ...entry.teamOverride.solicitationCode,
                teams: [{ ...entry.teamOverride, solicitationCode: undefined }],
              }
            : entry.teamOverride.solicitationCode
        );
      }

      if (!entry.entrySource) {
        return Err(new NotFoundError({ what: "FundraisingEntrySource" }));
      }
      if ("ddn" in entry.entrySource && entry.entrySource.ddn) {
        return Ok(entry.entrySource.ddn.solicitationCode);
      } else if (
        "dbFundsEntry" in entry.entrySource &&
        entry.entrySource.dbFundsEntry
      ) {
        return Ok(entry.entrySource.dbFundsEntry.dbFundsTeam.solicitationCode);
      } else {
        return Err(new InvariantError("Unexpected entry source type"));
      }
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }
}
