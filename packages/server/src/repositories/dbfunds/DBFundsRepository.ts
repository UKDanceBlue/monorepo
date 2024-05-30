import type { PrismaClient } from "@prisma/client";
import type { DateTime } from "luxon";
import { Maybe, Result } from "true-myth";
import { Service } from "typedi";

import { NotFoundError } from "../../lib/error/direct.js";
import { asBasicError } from "../../lib/error/error.js";
import { toPrismaError, type PrismaError } from "../../lib/error/prisma.js";
import { type JsResult } from "../../lib/error/result.js";
import type {
  MarathonRepository,
  UniqueMarathonParam,
} from "../marathon/MarathonRepository.js";

@Service()
export class DBFundsRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly marathonRepository: MarathonRepository
  ) {}

  async overwriteTeamForFiscalYear(
    dbNum: number,
    total: number,
    marathonParam: UniqueMarathonParam,
    entries: {
      donatedBy: string;
      donatedTo: Maybe<string>;
      donatedOn: DateTime;
      amount: number;
    }[]
  ): Promise<JsResult<never, PrismaError | NotFoundError>> {
    try {
      const marathon =
        await this.marathonRepository.findMarathonByUnique(marathonParam);
      if (!marathon) {
        return Result.err(new NotFoundError({ what: "Marathon" }));
      }
      await this.prisma.dBFundsTeam.upsert({
        where: {
          dbNum_marathonId: {
            dbNum,
            marathonId: marathon.id,
          },
        },
        create: {
          dbNum,
          totalAmount: total,
          marathon: {
            connect: { id: marathon.id },
          },
          entries: {
            create: entries.map((entry) => ({
              donatedBy: entry.donatedBy,
              donatedTo: entry.donatedTo.unwrapOr(null),
              donatedOn: entry.donatedOn.toJSDate(),
              amount: entry.amount,
            })),
          },
        },
        update: {
          totalAmount: total,
          fundraisingEntries: {
            deleteMany: {},
            createMany: {
              data: entries.map((entry) => ({
                donatedBy: entry.donatedBy,
                donatedTo: entry.donatedTo.unwrapOr(null),
                date: entry.donatedOn.toJSDate(),
                amount: entry.amount,
              })),
            },
          },
        },
      });
    } catch (error) {
      return Result.err(
        toPrismaError(error).unwrapOrElse(() => asBasicError(error))
      );
    }
  }
}
