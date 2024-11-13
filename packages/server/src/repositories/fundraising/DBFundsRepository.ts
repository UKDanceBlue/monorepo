import { Service } from "@freshgum/typedi";
import {
  DBFundsTeam,
  FundraisingEntryType,
  Prisma,
  PrismaClient,
  SolicitationCode,
  Team,
} from "@prisma/client";
import {
  BasicError,
  CompositeError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import { Err, None, Ok, Option, Result, Some } from "ts-results-es";

import { logger } from "#logging/standardLogging.js";
import type { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import {
  handleRepositoryError,
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";

export type UniqueDbFundsTeamParam =
  | {
      id: number;
    }
  | {
      uuid: string;
    }
  | {
      dbNum: number;
      marathon: { id: number };
    };

import { prismaToken } from "#prisma";

@Service([prismaToken, MarathonRepository])
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
      donatedBy: Option<string>;
      donatedTo: Option<string>;
      donatedOn: DateTime;
      amount: number;
    }[]
  ): Promise<
    Result<None, RepositoryError | CompositeError<BasicError | NotFoundError>>
  > {
    try {
      let marathonId: number;
      if ("id" in marathonParam) {
        marathonId = marathonParam.id;
      } else {
        const marathon =
          await this.marathonRepository.findMarathonByUnique(marathonParam);
        if (marathon.isErr()) {
          return marathon;
        }
        marathonId = marathon.value.id;
      }

      const solicitationCode = await this.prisma.solicitationCode.upsert({
        where: {
          prefix_code: {
            code: team.dbNum,
            prefix: "DB",
          },
        },
        create: {
          code: team.dbNum,
          prefix: "DB",
          name: team.name,
        },
        update: {},
      });

      const dBFundsTeam = await this.prisma.dBFundsTeam.upsert({
        where: {
          solicitationCodeId_marathonId: {
            solicitationCodeId: solicitationCode.id,
            marathonId,
          },
        },
        include: {
          fundraisingEntries: true,
        },
        create: {
          solicitationCode: {
            connect: { id: solicitationCode.id },
          },
          totalAmount: team.total,
          active: team.active,
          name: team.name,
          marathon: {
            connect: { id: marathonId },
          },
        },
        update: {
          totalAmount: team.total,
          active: team.active,
          name: team.name,
        },
      });

      const entriesToCreate: Prisma.DBFundsFundraisingEntryCreateWithoutDbFundsTeamInput[] =
        [];
      const entriesToUpdate: {
        amount: number;
        id: number;
      }[] = [];

      // Unlike the other lists, this one is removed from rather than added to
      const entryIdsToDelete = new Set<number>(
        dBFundsTeam.fundraisingEntries.map((entry) => entry.id)
      );

      // Populate the entries to create, update, and delete
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
            fundraisingEntrySource: {
              create: {
                entryWithMeta: {
                  create: {
                    type: FundraisingEntryType.Legacy,
                  },
                },
              },
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

      // If there are any entries to create, update, or delete, do so
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

        await this.prisma.$transaction([
          this.prisma.dBFundsFundraisingEntry.deleteMany({
            where: {
              id: {
                in: [...entryIdsToDelete],
              },
            },
          }),
          this.prisma.dBFundsFundraisingEntry.createMany({
            data: entriesToCreate.map((entry) => ({
              dbFundsTeamId: dBFundsTeam.id,
              amount: entry.amount,
              date: entry.date,
              donatedBy: entry.donatedBy,
              donatedTo: entry.donatedTo,
            })),
          }),
          this.prisma.dBFundsFundraisingEntry.updateMany({
            where: {
              id: {
                in: entriesToUpdate.map((entry) => entry.id),
              },
            },
            data: entriesToUpdate.map((entry) => ({
              amount: entry.amount,
            })),
          }),
        ]);
      }

      return Ok(None);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getTeamsForDbFundsTeam(
    dbFundsTeamParam: UniqueDbFundsTeamParam
  ): Promise<Result<Team[], RepositoryError>> {
    try {
      let where: Prisma.DBFundsTeamWhereUniqueInput;
      if ("marathon" in dbFundsTeamParam) {
        const solicitationCode = await this.prisma.solicitationCode.findUnique({
          where: {
            prefix_code: {
              code: dbFundsTeamParam.dbNum,
              prefix: "DB",
            },
          },
        });
        if (!solicitationCode) {
          return Err(new NotFoundError({ what: "Solicitation Code" }));
        }
        where = {
          solicitationCodeId_marathonId: {
            solicitationCodeId: solicitationCode.id,
            marathonId: dbFundsTeamParam.marathon.id,
          },
        };
      } else {
        where = dbFundsTeamParam;
      }
      const team = await this.prisma.dBFundsTeam.findUnique({
        where,
        include: { solicitationCode: { select: { teams: true } } },
      });
      if (!team) {
        return Err(new NotFoundError({ what: "Team" }));
      }
      return Ok(team.solicitationCode.teams);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getDbFundsTeamForTeam(
    teamParam: SimpleUniqueParam
  ): Promise<
    Result<
      Option<DBFundsTeam & { solicitationCode: SolicitationCode }>,
      RepositoryError
    >
  > {
    try {
      const team = await this.prisma.team.findUnique({
        where: teamParam,
        include: { solicitationCode: { include: { dbFundsTeams: true } } },
      });
      if (!team) {
        return Err(new NotFoundError({ what: "Team" }));
      }
      if (
        !team.solicitationCode ||
        team.solicitationCode.dbFundsTeams.length === 0
      ) {
        return Ok(None);
      }
      return Ok(
        Some({
          ...team.solicitationCode.dbFundsTeams[0]!,
          solicitationCode: team.solicitationCode,
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async assignTeamToDbFundsTeam(
    teamParam: SimpleUniqueParam,
    dbFundsTeamParam:
      | UniqueDbFundsTeamParam
      | {
          dbNum: number;
        }
  ): Promise<Result<None, RepositoryError>> {
    try {
      const team = await this.prisma.team.findUnique({
        where: teamParam,
      });
      if (!team) {
        return Err(new NotFoundError({ what: "Team" }));
      }
      if ("dbNum" in dbFundsTeamParam) {
        await this.prisma.team.update({
          where: { id: team.id },
          data: {
            solicitationCode: {
              connect: {
                prefix_code: {
                  code: dbFundsTeamParam.dbNum,
                  prefix: "DB",
                },
              },
            },
          },
        });
      } else {
        const dbfTeam = await this.prisma.dBFundsTeam.findUnique({
          where: dbFundsTeamParam,
        });
        if (!dbfTeam) {
          return Err(new NotFoundError({ what: "DB Funds Team" }));
        }

        await this.prisma.team.update({
          where: { id: team.id },
          data: {
            solicitationCode: {
              connect: {
                id: dbfTeam.solicitationCodeId,
              },
            },
          },
        });
      }

      return Ok(None);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async listDbFundsTeams(search: {
    byDbNum?: number;
    byName?: string;
    onlyActive?: boolean;
  }): Promise<
    Result<
      (DBFundsTeam & {
        solicitationCode: SolicitationCode;
      })[],
      RepositoryError
    >
  > {
    try {
      return Ok(
        await this.prisma.dBFundsTeam.findMany({
          where: {
            active: search.onlyActive ? true : undefined,
            solicitationCode: {
              code: search.byDbNum,
              prefix: "DB",
            },
            name: {
              contains: search.byName,
              mode: "insensitive",
            },
          },
          orderBy: {
            name: "asc",
          },
          include: {
            solicitationCode: true,
          },
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }
}
