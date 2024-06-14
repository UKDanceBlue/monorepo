import {
  DBFundsFundraisingEntry,
  FundraisingAssignment,
  FundraisingEntry,
  Person,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import Maybe, { just, nothing } from "true-myth/maybe";
import Result, { err, ok } from "true-myth/result";
import { Service } from "typedi";

import { ActionDeniedError } from "../../lib/error/control.js";
import { NotFoundError } from "../../lib/error/direct.js";
import { BasicError, toBasicError } from "../../lib/error/error.js";
import { SomePrismaError, toPrismaError } from "../../lib/error/prisma.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import { UniquePersonParam } from "../person/PersonRepository.js";
import type { SimpleUniqueParam } from "../shared.js";

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
      SomePrismaError | BasicError | NotFoundError
    >
  > {
    try {
      const row = await this.prisma.fundraisingEntry.findUnique({
        where: param,
        include: defaultInclude,
      });
      if (!row) {
        return err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      return ok(
        row as typeof row & {
          dbFundsEntry: NonNullable<typeof row.dbFundsEntry>;
        }
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async findAssignmentByUnique(
    param: FundraisingAssignmentUniqueParam
  ): Promise<
    Result<FundraisingAssignment, SomePrismaError | BasicError | NotFoundError>
  > {
    try {
      const row = await this.prisma.fundraisingAssignment.findUnique({
        where: param,
      });
      if (!row) {
        return err(new NotFoundError({ what: "FundraisingAssignment" }));
      }
      return ok(row);
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async getAssignmentsForEntry(
    param: FundraisingEntryUniqueParam
  ): Promise<
    Result<
      readonly FundraisingAssignment[],
      SomePrismaError | BasicError | NotFoundError
    >
  > {
    try {
      const entry = await this.prisma.fundraisingEntry.findUnique({
        where: param,
        select: { assignments: true },
      });
      if (!entry) {
        return err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      return ok(entry.assignments);
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
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
      SomePrismaError | BasicError | ActionDeniedError
    >
  > {
    try {
      const whereResult = buildFundraisingEntryWhere(filters);
      const orderByResult = buildFundraisingEntryOrder(order);
      if (whereResult.isErr) {
        return err(whereResult.error);
      }
      if (orderByResult.isErr) {
        return err(orderByResult.error);
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

      return ok(
        rows.filter(
          (
            row
          ): row is typeof row & {
            dbFundsEntry: NonNullable<typeof row.dbFundsEntry>;
          } => Boolean(row.dbFundsEntry)
        )
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async countEntries({
    filters,
  }: {
    filters?: readonly FundraisingEntryFilters[] | undefined | null;
  }): Promise<
    Result<number, SomePrismaError | BasicError | ActionDeniedError>
  > {
    try {
      const where = buildFundraisingEntryWhere(filters);
      if (where.isErr) {
        return err(where.error);
      }

      return ok(
        await this.prisma.fundraisingEntry.count({ where: where.value })
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async deleteEntry(
    param: FundraisingEntryUniqueParam
  ): Promise<Result<Maybe<FundraisingEntry>, SomePrismaError | BasicError>> {
    try {
      return ok(
        just(await this.prisma.fundraisingEntry.delete({ where: param }))
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return ok(nothing());
      } else {
        return err(
          toPrismaError(error).unwrapOrElse(() => toBasicError(error))
        );
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
      SomePrismaError | BasicError | NotFoundError | ActionDeniedError
    >
  > {
    try {
      const entry = await this.findEntryByUnique(entryParam);
      if (entry.isErr) {
        return err(entry.error);
      }
      const assignments = await this.getAssignmentsForEntry(entryParam);
      if (assignments.isErr) {
        return err(assignments.error);
      }

      const totalAssigned = assignments.value.reduce(
        (acc, assignment) => acc.add(assignment.amount),
        new Prisma.Decimal(0)
      );
      if (entry.value.dbFundsEntry.amount.lessThan(totalAssigned.add(amount))) {
        return err(
          new ActionDeniedError("Total assigned amount exceeds entry amount")
        );
      }

      return ok(
        await this.prisma.fundraisingAssignment.create({
          data: {
            amount,
            parentEntry: { connect: entryParam },
            person: { connect: personParam },
          },
        })
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async deleteAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<
    Result<FundraisingAssignment, SomePrismaError | BasicError | NotFoundError>
  > {
    try {
      return ok(
        await this.prisma.fundraisingAssignment.delete({
          where: assignmentParam,
        })
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async updateAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam,
    { amount }: { amount: number }
  ): Promise<
    Result<
      FundraisingAssignment,
      SomePrismaError | BasicError | NotFoundError | ActionDeniedError
    >
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
        return err(new NotFoundError({ what: "FundraisingEntry" }));
      }
      const assignments = await this.getAssignmentsForEntry({
        id: assignment.parentEntry.id,
      });
      if (assignments.isErr) {
        return err(assignments.error);
      }

      const totalAssigned = assignments.value
        .filter((a) => a.id !== assignment.id)
        .reduce(
          (acc, assignment) => acc.add(assignment.amount),
          new Prisma.Decimal(0)
        );
      if (
        assignment.parentEntry.dbFundsEntry &&
        assignment.parentEntry.dbFundsEntry.amount.lessThan(
          totalAssigned.add(amount)
        )
      ) {
        return err(
          new ActionDeniedError("Total assigned amount exceeds entry amount")
        );
      }

      return ok(
        await this.prisma.fundraisingAssignment.update({
          where: assignmentParam,
          data: { amount },
        })
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async getPersonForAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<Result<Person, SomePrismaError | BasicError | NotFoundError>> {
    try {
      const assignment = await this.prisma.fundraisingAssignment.findUnique({
        where: assignmentParam,
        select: { person: true },
      });
      if (!assignment) {
        return err(new NotFoundError({ what: "FundraisingAssignment" }));
      }
      return ok(assignment.person);
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async getEntryForAssignment(
    assignmentParam: FundraisingAssignmentUniqueParam
  ): Promise<
    Result<
      FundraisingEntry & {
        dbFundsEntry: DBFundsFundraisingEntry;
      },
      SomePrismaError | BasicError | NotFoundError
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
        return err(new NotFoundError({ what: "FundraisingAssignment" }));
      }
      return ok(
        assignment.parentEntry as typeof assignment.parentEntry & {
          dbFundsEntry: NonNullable<typeof assignment.parentEntry.dbFundsEntry>;
        }
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async getAssignmentsForPerson(
    personParam: UniquePersonParam
  ): Promise<
    Result<
      readonly FundraisingAssignment[],
      SomePrismaError | BasicError | NotFoundError
    >
  > {
    try {
      const assignments = await this.prisma.fundraisingAssignment.findMany({
        where: { person: personParam },
      });
      return ok(assignments);
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }
}
