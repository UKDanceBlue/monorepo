import { DBFundsTeam, Prisma, PrismaClient, Team } from "@prisma/client";
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
import { logger } from "../../lib/logging/standardLogging.js";
import type { UniqueMarathonParam } from "../marathon/MarathonRepository.js";
import { MarathonRepository } from "../marathon/MarathonRepository.js";
import { SimpleUniqueParam } from "../shared.js";

export type UniqueDbFundsTeamParam =
  | {
      id: number;
    }
  | {
      dbNum: number;
      marathon: { id: number };
    };

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
    dbFundsEntries: {
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

      let dBFundsTeam = await this.prisma.dBFundsTeam.findUnique({
        where: {
          dbNum_marathonId: {
            dbNum: team.dbNum,
            marathonId,
          },
        },
        include: {
          fundraisingEntries: true,
        },
      });

      if (!dBFundsTeam) {
        dBFundsTeam = await this.prisma.dBFundsTeam.create({
          data: {
            dbNum: team.dbNum,
            totalAmount: team.total,
            active: team.active,
            name: team.name,
            marathon: {
              connect: { id: marathonId },
            },
          },
          include: {
            fundraisingEntries: true,
          },
        });
      }

      const entriesToCreate: Prisma.DBFundsFundraisingEntryCreateWithoutDbFundsTeamInput[] =
        [];
      const entriesToUpdate: {
        amount: number;
        id: number;
      }[] = [];

      // Unlike the other lists, this one is removed from rather than added to
      const entryIdsToDelete: Set<number> = new Set(
        dBFundsTeam.fundraisingEntries.map((entry) => entry.id)
      );

      for (const entry of dbFundsEntries) {
        const entryDonatedOnMillis = entry.donatedOn.toMillis();
        const existingEntry = dBFundsTeam.fundraisingEntries.find(
          (e) =>
            e.donatedBy === entry.donatedBy.unwrapOr(null) &&
            e.donatedTo === entry.donatedTo.unwrapOr(null) &&
            e.date.getTime() === entryDonatedOnMillis
        );

        if (!existingEntry) {
          entriesToCreate.push({
            donatedBy: entry.donatedBy.unwrapOr(null),
            donatedTo: entry.donatedTo.unwrapOr(null),
            date: entry.donatedOn.toJSDate(),
            amount: entry.amount,
            fundraisingEntry: {
              create: {},
            },
          });
        } else {
          entryIdsToDelete.delete(existingEntry.id);
          if (existingEntry.amount.toNumber() !== entry.amount) {
            entriesToUpdate.push({
              amount: entry.amount,
              id: existingEntry.id,
            });
          }
        }
      }

      if (
        entriesToCreate.length > 0 ||
        entriesToUpdate.length > 0 ||
        entryIdsToDelete.size > 0
      ) {
        logger.debug(`Fundraising Sync`, {
          team: { name: team.name, dbNum: team.dbNum },
          entries: {
            toCreate: entriesToCreate.length,
            toUpdate: entriesToUpdate.length,
            toDelete: entryIdsToDelete.size,
          },
        });

        await this.prisma.dBFundsTeam.update({
          where: {
            id: dBFundsTeam.id,
          },
          data: {
            fundraisingEntries: {
              deleteMany: {
                id: {
                  in: [...entryIdsToDelete],
                },
              },
              create: entriesToCreate,
              update: entriesToUpdate.map(({ amount, id }) => ({
                where: { id },
                data: {
                  amount,
                  fundraisingEntry: {
                    upsert: {
                      update: {
                        assignments: {
                          deleteMany: {},
                        },
                      },
                      create: {},
                    },
                  },
                },
              })),
            },
          },
          include: {
            fundraisingEntries: true,
          },
        });
      }

      return Result.ok();
    } catch (error) {
      return Result.err(
        toPrismaError(error).unwrapOrElse(() => toBasicError(error))
      );
    }
  }

  async getTeamsForDbFundsTeam(
    dbFundsTeamParam: UniqueDbFundsTeamParam
  ): Promise<Result<Team[], NotFoundError | SomePrismaError | BasicError>> {
    try {
      const team = await this.prisma.dBFundsTeam.findUnique({
        where:
          "marathon" in dbFundsTeamParam
            ? {
                dbNum_marathonId: {
                  dbNum: dbFundsTeamParam.dbNum,
                  marathonId: dbFundsTeamParam.marathon.id,
                },
              }
            : dbFundsTeamParam,
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

  async assignTeamToDbFundsTeam(
    teamParam: SimpleUniqueParam,
    dbFundsTeamParam:
      | UniqueDbFundsTeamParam
      | {
          dbNum: number;
        }
  ): Promise<Result<Unit, NotFoundError | SomePrismaError | BasicError>> {
    try {
      const team = await this.prisma.team.findUnique({
        where: teamParam,
      });
      if (!team) {
        return err(new NotFoundError({ what: "Team" }));
      }
      await this.prisma.dBFundsTeam.update({
        where:
          "dbNum" in dbFundsTeamParam
            ? {
                dbNum_marathonId: {
                  dbNum: dbFundsTeamParam.dbNum,
                  marathonId:
                    "marathon" in dbFundsTeamParam
                      ? dbFundsTeamParam.marathon.id
                      : team.marathonId,
                },
              }
            : dbFundsTeamParam,
        data: {
          teams: {
            connect: { id: team.id },
          },
        },
      });
      return ok();
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