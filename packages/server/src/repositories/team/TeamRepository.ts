import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient, SolicitationCode, Team } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type {
  BulkTeamInput,
  FieldsOfListQueryArgs,
  ListTeamsArgs,
  TeamType,
} from "@ukdanceblue/common";
import {
  getFiscalYear,
  MembershipPositionType,
  TeamLegacyStatus,
} from "@ukdanceblue/common";
import { ConcreteResult, optionOf } from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import { None, Ok, Option, Result, Some } from "ts-results-es";

import { PrismaService } from "#lib/prisma.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";
import { type UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import {
  type AsyncRepositoryResult,
  handleRepositoryError,
  RepositoryError,
  type SimpleUniqueParam,
} from "#repositories/shared.js";

type TeamUniqueParam = SimpleUniqueParam;

@Service([PrismaService])
export class TeamRepository extends buildDefaultRepository<
  PrismaClient["teamWithMeta"],
  TeamUniqueParam,
  FieldsOfListQueryArgs<ListTeamsArgs>
>("Team", {
  name: {
    getWhere: (name) => Ok({ name }),
    getOrderBy: (name) => Ok({ name }),
    searchable: true,
  },
  legacyStatus: {
    getWhere: (legacyStatus) => Ok({ legacyStatus }),
    getOrderBy: (legacyStatus) => Ok({ legacyStatus }),
  },
  marathonYear: {
    getWhere: (marathonYear) => Ok({ marathon: { year: marathonYear } }),
    getOrderBy: (marathonYear) => Ok({ marathon: { year: marathonYear } }),
  },
  type: {
    getWhere: (type) => Ok({ type }),
    getOrderBy: (type) => Ok({ type }),
  },
  totalPoints: {
    getOrderBy: (totalPoints) => Ok({ totalPoints }),
    getWhere: (totalPoints) => Ok({ totalPoints }),
  },
}) {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  public uniqueToWhere(by: TeamUniqueParam) {
    return TeamRepository.simpleUniqueToWhere(by);
  }

  /**
   * Find a team by its unique identifier
   */
  findTeamByUnique(param: TeamUniqueParam) {
    return this.prisma.teamWithMeta.findUnique({ where: param });
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
    onlyDemo,
    ...params
  }: FindAndCountParams<FieldsOfListQueryArgs<ListTeamsArgs>> & {
    onlyDemo?: boolean;
  }): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.TeamWithMetaDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: Record<string, never> }
    >
  > {
    const where: Prisma.TeamWithMetaWhereInput[] = [];

    if (onlyDemo) {
      where.push({
        legacyStatus: {
          in: [TeamLegacyStatus.DemoTeam],
        },
      });
    }

    return this.parseFindManyParams(params, where)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).teamWithMeta.findMany(params)
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).teamWithMeta.count({
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
      const marathon = await this.getMarathon(param);
      if (!marathon) {
        return Ok(None);
      }
      const fy = getFiscalYear(
        DateTime.fromObject({
          year: Number.parseInt(`20${marathon.year.substring(2)}`, 10),
        })
      );
      const {
        _sum: { amount },
      } = await this.prisma.fundraisingEntryWithMeta.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          donatedOn: {
            lte: fy.end!.toJSDate(),
            gte: fy.start!.toJSDate(),
          },
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
