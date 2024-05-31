import type { PrismaClient } from "@prisma/client";
import type { DateTime } from "luxon";
import { Maybe, Result } from "true-myth";
import { Service } from "typedi";

import { NotFoundError } from "../../lib/error/direct.js";
import { toBasicError } from "../../lib/error/error.js";
import { PrismaError, toPrismaError } from "../../lib/error/prisma.js";
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
    team: {
      total: number;
      dbNum: number;
      active: boolean;
      name: string;
    },
    marathonParam: UniqueMarathonParam,
    entries: {
      donatedBy: string;
      donatedTo: Maybe<string>;
      donatedOn: DateTime;
      amount: number;
    }[]
  ): Promise<JsResult<void, PrismaError | NotFoundError>> {
    try {
      let marathonId: number;
      if ("id" in marathonParam) {
        marathonId = marathonParam.id;
      } else {
        const marathon =
          await this.marathonRepository.findMarathonByUnique(marathonParam);
        if (!marathon) {
          return Result.err(new NotFoundError({ what: "Marathon" }));
        }
        marathonId = marathon.id;
      }
      await this.prisma.dBFundsTeam.upsert({
        where: {
          dbNum_marathonId: {
            dbNum: team.dbNum,
            marathonId,
          },
        },
        create: {
          dbNum: team.dbNum,
          totalAmount: team.total,
          active: team.active,
          name: team.name,
          marathon: {
            connect: { id: marathonId },
          },
          fundraisingEntries: {
            create: entries.map((entry) => ({
              donatedBy: entry.donatedBy,
              donatedTo: entry.donatedTo.unwrapOr(null),
              date: entry.donatedOn.toJSDate(),
              amount: entry.amount,
            })),
          },
        },
        update: {
          totalAmount: team.total,
          name: team.name,
          active: team.active,
          fundraisingEntries: {
            deleteMany: {},
            create: entries.map((entry) => ({
              donatedBy: entry.donatedBy,
              donatedTo: entry.donatedTo.unwrapOr(null),
              date: entry.donatedOn.toJSDate(),
              amount: entry.amount,
            })),
          },
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.err(
        toPrismaError(error).unwrapOrElse(() => toBasicError(error))
      );
    }
  }
}
