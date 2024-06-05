import {
  DBFundsFundraisingEntry,
  FundraisingAssignment,
  FundraisingEntry,
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

const fundraisingEntryOneOfKeys = [] as const;
type FundraisingEntryOneOfKey = (typeof fundraisingEntryOneOfKeys)[number];

const fundraisingEntryStringKeys = ["donatedTo", "donatedBy"] as const;
type FundraisingEntryStringKey = (typeof fundraisingEntryStringKeys)[number];

export type FundraisingEntryOrderKeys =
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

  async findFundraisingEntryByUnique(
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
      if (!row?.dbFundsEntry) {
        return err(
          new NotFoundError({ what: "FundraisingEntry.dbFundsEntry" })
        );
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

  async getFundraisingAssignmentsForEntry(
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

  async listFundraisingEntries({
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
  }): Promise<
    Result<
      readonly (FundraisingEntry & {
        dbFundsEntry: DBFundsFundraisingEntry | null;
      })[],
      SomePrismaError | BasicError
    >
  > {
    try {
      const where = buildFundraisingEntryWhere(filters);
      const orderBy = buildFundraisingEntryOrder(order);

      return ok(
        await this.prisma.fundraisingEntry.findMany({
          include: defaultInclude,
          where,
          orderBy,
          skip: skip ?? undefined,
          take: take ?? undefined,
        })
      );
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async countFundraisingEntries({
    filters,
  }: {
    filters?: readonly FundraisingEntryFilters[] | undefined | null;
  }): Promise<Result<number, SomePrismaError | BasicError>> {
    try {
      const where = buildFundraisingEntryWhere(filters);

      return ok(await this.prisma.fundraisingEntry.count({ where }));
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async connectFundraisingEntry(
    dbFundsEntry: DBFundsFundraisingEntry
  ): Promise<
    Result<FundraisingEntryUniqueParam, SomePrismaError | BasicError>
  > {
    try {
      const row = await this.prisma.fundraisingEntry.upsert({
        where: { id: dbFundsEntry.id },
        update: {},
        create: {
          dbFundsEntry: {
            connect: { id: dbFundsEntry.id },
          },
        },
      });
      return ok({
        id: row.id,
      });
    } catch (error: unknown) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async deleteFundraisingEntry(
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

  async addAssignmentToFundraisingEntry(
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
      const entry = await this.findFundraisingEntryByUnique(entryParam);
      if (entry.isErr) {
        return err(entry.error);
      }
      const assignments =
        await this.getFundraisingAssignmentsForEntry(entryParam);
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

  async removeAssignmentFromFundraisingEntry(
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
      const assignments = await this.getFundraisingAssignmentsForEntry({
        id: assignment.parentEntry.id,
      });
      if (assignments.isErr) {
        return err(assignments.error);
      }

      if (!assignment.parentEntry.dbFundsEntry) {
        return err(
          new ActionDeniedError("Entry is not connected to a DBFunds entry")
        );
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
}
