import { DBFundsTeam, PrismaClient, Team } from "@prisma/client";
import { DateTime } from "luxon";
import { Maybe, Result, Unit } from "true-myth";
import { err, ok } from "true-myth/result";
import { Service } from "typedi";

import { CompositeError } from "../../lib/error/composite.js";
import { NotFoundError } from "../../lib/error/direct.js";
import { BasicError, toBasicError } from "../../lib/error/error.js";
import {
  PrismaError,
  SomePrismaError,
  toPrismaError,
} from "../../lib/error/prisma.js";
import type { UniqueMarathonParam } from "../marathon/MarathonRepository.js";
import { MarathonRepository } from "../marathon/MarathonRepository.js";

import { FundraisingEntryRepository } from "./FundraisingRepository.js";

@Service()
export class DBFundsRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly marathonRepository: MarathonRepository,
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
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
      donatedBy: Maybe<string>;
      donatedTo: Maybe<string>;
      donatedOn: DateTime;
      amount: number;
    }[]
  ): Promise<
    Result<
      Unit,
      | PrismaError
      | NotFoundError
      | CompositeError<PrismaError | BasicError>
      | BasicError
    >
  > {
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
      const rows = await this.prisma.dBFundsTeam.upsert({
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
              donatedBy: entry.donatedBy.unwrapOr(null),
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
            // This deletes all existing entries, including ones from past years. This is intentional as it means we aren't persisting sensitive data that we won't be using anyways
            // If it ever becomes desired to keep this data, simple filter the delete to only entries from the current marathon
            deleteMany: {},
            create: entries.map((entry) => ({
              donatedBy: entry.donatedBy.unwrapOr(null),
              donatedTo: entry.donatedTo.unwrapOr(null),
              date: entry.donatedOn.toJSDate(),
              amount: entry.amount,
            })),
          },
        },
        select: {
          fundraisingEntries: true,
        },
      });

      const results = await Promise.allSettled(
        rows.fundraisingEntries.map(async (entry) => {
          return this.fundraisingEntryRepository.connectEntry(entry);
        })
      );

      const errors: (PrismaError | BasicError)[] = [];
      for (const result of results) {
        if (result.status === "rejected") {
          errors.push(
            toPrismaError(result.reason).unwrapOrElse(() =>
              toBasicError(result.reason)
            )
          );
        } else if (result.value.isErr) {
          errors.push(result.value.error);
        }
      }

      return errors.length > 0
        ? Result.err(new CompositeError(errors))
        : Result.ok();
    } catch (error) {
      return Result.err(
        toPrismaError(error).unwrapOrElse(() => toBasicError(error))
      );
    }
  }

  async getTeamsForDbFundsTeam(dbFundsTeamParam: {
    id: number;
  }): Promise<Result<Team[], NotFoundError | SomePrismaError | BasicError>> {
    try {
      const team = await this.prisma.dBFundsTeam.findUnique({
        where: dbFundsTeamParam,
        include: { teams: true },
      });
      if (!team) {
        return err(new NotFoundError({ what: "Team" }));
      }
      return ok(team.teams);
    } catch (error) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }

  async listDbFundsTeams(search: {
    byDbNum?: number;
    byName?: string;
    onlyActive?: boolean;
  }): Promise<Result<DBFundsTeam[], SomePrismaError | BasicError>> {
    try {
      return ok(
        await this.prisma.dBFundsTeam.findMany({
          where: {
            active: search.onlyActive ? true : undefined,
            dbNum: search.byDbNum,
            name: {
              contains: search.byName,
            },
          },
          orderBy: {
            name: "asc",
          },
        })
      );
    } catch (error) {
      return err(toPrismaError(error).unwrapOrElse(() => toBasicError(error)));
    }
  }
}
