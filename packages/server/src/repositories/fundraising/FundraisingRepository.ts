import {
  buildFundraisingEntryOrder,
  buildFundraisingEntryWhere,
} from "./fundraisingEntryRepositoryUtils.js";

import { UniquePersonParam } from "#repositories/person/PersonRepository.js";
import {
  RepositoryError,
  SimpleUniqueParam,
  handleRepositoryError,
} from "#repositories/shared.js";

import {
  DBFundsFundraisingEntry,
  FundraisingAssignment,
  FundraisingEntry,
  Person,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import {
  ActionDeniedError,
  InvalidArgumentError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";
import { Service } from "typedi";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { SortDirection } from "@ukdanceblue/common";


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

const fundraisingEntryNumericKeys = ["amount"] as const;
type FundraisingEntryNumericKey = (typeof fundraisingEntryNumericKeys)[number];

const fundraisingEntryOneOfKeys = ["teamId"] as const;
type FundraisingEntryOneOfKey = (typeof fundraisingEntryOneOfKeys)[number];

const fundraisingEntryStringKeys = ["donatedTo", "donatedBy"] as const;
type FundraisingEntryStringKey = (typeof fundraisingEntryStringKeys)[number];

export type FundraisingEntryOrderKeys =
  | "teamId"
  | "donatedOn"
  | "amount"
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
  dbFundsEntry: true,
} satisfies Prisma.FundraisingEntryInclude;

export type FundraisingEntryUniqueParam = SimpleUniqueParam;
export type FundraisingAssignmentUniqueParam = SimpleUniqueParam;

@Service()
export class FundraisingEntryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findEntryByUnique(
    param: FundraisingEntryUniqueParam
  ): Promise<
    Result<
      FundraisingEntry & { dbFundsEntry: DBFundsFundraisingEntry },
      RepositoryError
    >
  > {
    try {
      const row = await this.prisma.fundraisingEntry.findUnique({
        where: param,
        include: defaultInclude,
      });
      if (!row) {
        return Err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      return Ok(
        row
      );
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
      const entry = await this.prisma.fundraisingEntry.findUnique({
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
      readonly (FundraisingEntry & {
        dbFundsEntry: DBFundsFundraisingEntry;
      })[],
      RepositoryError | ActionDeniedError | InvalidArgumentError
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
        where.dbFundsEntry = {
          ...where.dbFundsEntry,
          // @ts-expect-error Don't know why this is causing an error, but I'm not going to worry about it
          dbFundsTeam: {
            teams: {
              some: limits.forTeam,
            },
            // This 'satisfies' is to make sure that we don't accidentally ignore errors due to the ts-expect-error above
          } satisfies Prisma.DBFundsTeamWhereInput,
        };
      }

      const rows = await this.prisma.fundraisingEntry.findMany({
        include: defaultInclude,
        where,
        orderBy,
        skip: skip ?? undefined,
        take: take ?? undefined,
      });

      return Ok(
        rows.filter(
          (
            row
          ): row is typeof row & {
            dbFundsEntry: NonNullable<typeof row.dbFundsEntry>;
          } => Boolean(row.dbFundsEntry)
        )
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async countEntries({
    filters,
  }: {
    filters?: readonly FundraisingEntryFilters[] | undefined | null;
  }): Promise<
    Result<number, RepositoryError | ActionDeniedError | InvalidArgumentError>
  > {
    try {
      const where = buildFundraisingEntryWhere(filters);
      if (where.isErr()) {
        return Err(where.error);
      }

      return Ok(
        await this.prisma.fundraisingEntry.count({ where: where.value })
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
    Result<FundraisingAssignment, RepositoryError | ActionDeniedError>
  > {
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
      if (entry.value.dbFundsEntry.amount.lessThan(totalAssigned.add(amount))) {
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
    try {
      const assignment = await this.prisma.fundraisingAssignment.findUnique({
        where: assignmentParam,
        select: {
          id: true,
          parentEntry: {
            select: { dbFundsEntry: { select: { amount: true } }, id: true },
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
      if (
        assignment.parentEntry.dbFundsEntry.amount.lessThan(
          totalAssigned.add(amount)
        )
      ) {
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

  async getEntryForAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<
    Result<
      FundraisingEntry & {
        dbFundsEntry: DBFundsFundraisingEntry;
      },
      RepositoryError
    >
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
      return Ok(
        assignment.parentEntry
      );
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
}
