import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient, SolicitationCode, Team } from "@prisma/client";
import type {
  BulkTeamInput,
  FieldsOfListQueryArgs,
  ListTeamsArgs,
  MarathonYearString,
  TeamType,
} from "@ukdanceblue/common";
import { MembershipPositionType, TeamLegacyStatus } from "@ukdanceblue/common";
import { ConcreteResult, optionOf } from "@ukdanceblue/common/error";
import { None, Ok, Option, Result, Some } from "ts-results-es";

import type { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import {
  type AsyncRepositoryResult,
  handleRepositoryError,
  RepositoryError,
  type SimpleUniqueParam,
} from "#repositories/shared.js";

type MarathonParam = SimpleUniqueParam | { year: MarathonYearString };

function makeMarathonWhere(param: MarathonParam[]) {
  const marathonIds: number[] = [];
  const marathonUuids: string[] = [];
  const marathonYears: MarathonYearString[] = [];
  for (const m of param) {
    if ("id" in m) {
      marathonIds.push(m.id);
    } else if ("uuid" in m) {
      marathonUuids.push(m.uuid);
    } else if ("year" in m) {
      marathonYears.push(m.year);
    } else {
      m satisfies never;
    }
  }
  return {
    OR: [
      { id: { in: marathonIds } },
      { uuid: { in: marathonUuids } },
      { year: { in: marathonYears } },
    ],
  };
}

import type { DefaultArgs } from "@prisma/client/runtime/library";

import { prismaToken } from "#lib/typediTokens.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";

type TeamUniqueParam = SimpleUniqueParam;

@Service([prismaToken])
export class TeamRepository extends buildDefaultRepository<
  PrismaClient["team"],
  TeamUniqueParam,
  FieldsOfListQueryArgs<ListTeamsArgs>
>("Team", {}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(by: TeamUniqueParam) {
    return TeamRepository.simpleUniqueToWhere(by);
  }

  /**
   * Find a team by its unique identifier
   */
  findTeamByUnique(param: TeamUniqueParam) {
    return this.prisma.team.findUnique({ where: param });
  }

  findMembersOfTeam(
    param: { uuid: string } | { id: number },
    {
      captainsOnly = false,
    }: {
      captainsOnly?: boolean;
    } = {}
  ) {
    return this.prisma.membership.findMany({
      where: {
        team: param,
        position: captainsOnly
          ? {
              equals: "Captain",
            }
          : undefined,
      },
    });
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<
    "name" | "type" | "legacyStatus" | "marathonId"
  >): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.TeamDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: Record<string, never> }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError((tx ?? this.prisma).team.findMany(params)).map(
          (rows) => ({ rows, params })
        )
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).team.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
  }

  getTotalTeamPoints(param: TeamUniqueParam) {
    return this.prisma.pointEntry.aggregate({
      _sum: {
        points: true,
      },
      where: {
        team: param,
      },
    });
  }

  getTeamCommitteeIdentifier(param: TeamUniqueParam) {
    return this.prisma.team
      .findUnique({
        where: param,
      })
      .correspondingCommittee()
      .then((committee) => committee?.identifier);
  }

  getTeamPointEntries(param: TeamUniqueParam) {
    return this.prisma.pointEntry.findMany({
      where: {
        team: param,
      },
    });
  }

  async getTotalFundraisingAmount(
    param: TeamUniqueParam
  ): Promise<ConcreteResult<Option<number>, RepositoryError>> {
    try {
      const {
        _sum: { amount },
      } = await this.prisma.fundraisingEntryWithMeta.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          OR: [
            {
              AND: [
                {
                  solicitationCodeOverride: {
                    is: null,
                  },
                },
                {
                  OR: [
                    {
                      dbFundsEntry: {
                        dbFundsTeam: {
                          solicitationCode: {
                            teams: {
                              some: param,
                            },
                          },
                        },
                      },
                    },
                    {
                      ddn: {
                        solicitationCode: {
                          teams: {
                            some: param,
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              solicitationCodeOverride: {
                teams: {
                  some: param,
                },
              },
            },
          ],
        },
      });
      return Ok(
        amount !== null ? Some(amount.toDecimalPlaces(2).toNumber()) : None
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  getMarathon(team: TeamUniqueParam) {
    return this.prisma.team
      .findUnique({
        where: team,
      })
      .marathon();
  }

  createTeam(
    data: {
      name: string;
      type: TeamType;
      legacyStatus: TeamLegacyStatus;
    },
    marathon: UniqueMarathonParam
  ) {
    return this.prisma.team.create({
      data: {
        ...data,
        marathon: {
          connect: marathon,
        },
      },
    });
  }

  updateTeam(param: TeamUniqueParam, data: Prisma.TeamUpdateInput) {
    try {
      return this.prisma.team.update({ where: param, data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  async bulkLoadTeams(
    teams: BulkTeamInput[],
    marathonParam: UniqueMarathonParam
  ): Promise<Result<Team[], RepositoryError>> {
    try {
      const existingMatchesList = await Promise.all(
        teams.map((team) =>
          this.prisma.team.findFirst({
            where: {
              name: team.name,
              marathon: marathonParam,
            },
          })
        )
      );

      const toCreate: Prisma.TeamCreateInput[] = [];
      const toUpdate: Prisma.TeamUpdateArgs[] = [];

      for (let i = 0; i < teams.length; i++) {
        const team = teams[i];
        const existingMatch = existingMatchesList[i];
        if (!team) {
          continue;
        }

        if (existingMatch) {
          toUpdate.push({
            where: { id: existingMatch.id },
            data: {
              type: team.type,
              legacyStatus: team.legacyStatus,
            },
          });
        } else {
          toCreate.push({
            name: team.name,
            type: team.type,
            legacyStatus: team.legacyStatus,
            marathon: {
              connect: marathonParam,
            },
            memberships: {
              create: [
                ...(team.captainLinkblues?.map(
                  (linkblue): Prisma.MembershipCreateWithoutTeamInput => ({
                    person: {
                      connectOrCreate: {
                        where: {
                          linkblue: linkblue.toLowerCase(),
                        },
                        create: {
                          linkblue: linkblue.toLowerCase(),
                          email: `${linkblue.toLowerCase()}@uky.edu`,
                        },
                      },
                    },
                    position: MembershipPositionType.Captain,
                  })
                ) ?? []),
                ...(team.memberLinkblues?.map(
                  (linkblue): Prisma.MembershipCreateWithoutTeamInput => ({
                    person: {
                      connectOrCreate: {
                        where: {
                          linkblue: linkblue.toLowerCase(),
                        },
                        create: {
                          linkblue: linkblue.toLowerCase(),
                          email: `${linkblue.toLowerCase()}@uky.edu`,
                        },
                      },
                    },
                    position: MembershipPositionType.Member,
                  })
                ) ?? []),
              ],
            },
          });
        }
      }

      const results = await this.prisma.$transaction([
        ...toCreate.map((create) => this.prisma.team.create({ data: create })),
        ...toUpdate.map((update) => this.prisma.team.update(update)),
      ]);

      return Ok(results);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  deleteTeam(param: TeamUniqueParam) {
    try {
      return this.prisma.team.delete({ where: param });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  async getSolicitationCodeForTeam(
    param: TeamUniqueParam
  ): Promise<ConcreteResult<Option<SolicitationCode>, RepositoryError>> {
    try {
      const team = await this.prisma.team.findUnique({
        where: param,
        include: {
          solicitationCode: true,
        },
      });
      return Ok(optionOf(team?.solicitationCode));
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }
}
