import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient, SolicitationCode, Team } from "@prisma/client";
import type {
  BulkTeamInput,
  MarathonYearString,
  SortDirection,
  TeamType,
} from "@ukdanceblue/common";
import { MembershipPositionType, TeamLegacyStatus } from "@ukdanceblue/common";
import {
  BasicError,
  ConcreteResult,
  optionOf,
} from "@ukdanceblue/common/error";
import { None, Ok, Option, Result, Some } from "ts-results-es";

import { SomePrismaError } from "#error/prisma.js";
import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import {
  handleRepositoryError,
  RepositoryError,
  type SimpleUniqueParam,
} from "#repositories/shared.js";

import { buildTeamOrder, buildTeamWhere } from "./teamRepositoryUtils.js";

const teamBooleanKeys = [] as const;
type TeamBooleanKey = (typeof teamBooleanKeys)[number];

const teamDateKeys = ["createdAt", "updatedAt"] as const;
type TeamDateKey = (typeof teamDateKeys)[number];

const teamIsNullKeys = [] as const;
type TeamIsNullKey = (typeof teamIsNullKeys)[number];

const teamNumericKeys = ["totalPoints"] as const;
type TeamNumericKey = (typeof teamNumericKeys)[number];

const teamOneOfKeys = ["type", "marathonId", "legacyStatus"] as const;
type TeamOneOfKey = (typeof teamOneOfKeys)[number];

const teamStringKeys = ["name"] as const;
type TeamStringKey = (typeof teamStringKeys)[number];

export type TeamFilters = FilterItems<
  TeamBooleanKey,
  TeamDateKey,
  TeamIsNullKey,
  TeamNumericKey,
  TeamOneOfKey,
  TeamStringKey
>;

export type TeamOrderKeys =
  | "createdAt"
  | "updatedAt"
  | "type"
  | "marathonId"
  | "legacyStatus"
  | "name"
  | "totalPoints";

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

import { prismaToken } from "#lib/typediTokens.js";

@Service([prismaToken])
export class TeamRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find a team by its unique identifier
   */
  findTeamByUnique(param: SimpleUniqueParam) {
    return this.prisma.team.findUnique({ where: param });
  }

  /**
   * Find teams based on filters
   */
  listTeams({
    filters,
    order,
    skip,
    take,
    onlyDemo,
    legacyStatus,
    marathon,
    type,
  }: {
    filters?: readonly TeamFilters[] | undefined | null;
    order?:
      | readonly [key: TeamOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
    onlyDemo?: boolean;
    legacyStatus?: TeamLegacyStatus[] | undefined | null;
    marathon: MarathonParam[] | undefined | null;
    type?: TeamType[] | undefined | null;
  }) {
    const where = buildTeamWhere(filters);
    const orderBy = buildTeamOrder(order);

    return this.prisma.teamsWithTotalPoints.findMany({
      where: {
        type: type ? { in: type } : undefined,
        marathon: marathon ? makeMarathonWhere(marathon) : undefined,

        ...where,
        legacyStatus: legacyStatus
          ? { in: legacyStatus }
          : (where.legacyStatus ??
            (onlyDemo
              ? {
                  equals: TeamLegacyStatus.DemoTeam,
                }
              : {
                  not: TeamLegacyStatus.DemoTeam,
                })),
      },
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countTeams({
    filters,
    onlyDemo,
    legacyStatus,
    marathon,
    type,
  }: {
    filters?: readonly TeamFilters[] | undefined | null;
    onlyDemo?: boolean;
    legacyStatus?: TeamLegacyStatus[] | undefined | null;
    marathon: MarathonParam[] | undefined | null;
    type?: TeamType[] | undefined | null;
  }) {
    const where = buildTeamWhere(filters);

    return this.prisma.teamsWithTotalPoints.count({
      where: {
        type: type ? { in: type } : undefined,
        marathon: makeMarathonWhere(marathon ?? []),

        ...where,
        legacyStatus: legacyStatus
          ? { in: legacyStatus }
          : (where.legacyStatus ??
            (onlyDemo
              ? {
                  equals: TeamLegacyStatus.DemoTeam,
                }
              : {
                  not: TeamLegacyStatus.DemoTeam,
                })),
      },
    });
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

  getTotalTeamPoints(param: SimpleUniqueParam) {
    return this.prisma.pointEntry.aggregate({
      _sum: {
        points: true,
      },
      where: {
        team: param,
      },
    });
  }

  getTeamCommitteeIdentifier(param: SimpleUniqueParam) {
    return this.prisma.team
      .findUnique({
        where: param,
      })
      .correspondingCommittee()
      .then((committee) => committee?.identifier);
  }

  getTeamPointEntries(param: SimpleUniqueParam) {
    return this.prisma.pointEntry.findMany({
      where: {
        team: param,
      },
    });
  }

  async getTotalFundraisingAmount(
    param: SimpleUniqueParam
  ): Promise<ConcreteResult<Option<number>, SomePrismaError | BasicError>> {
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

  getMarathon(team: SimpleUniqueParam) {
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

  updateTeam(param: SimpleUniqueParam, data: Prisma.TeamUpdateInput) {
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

  deleteTeam(param: SimpleUniqueParam) {
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
    param: SimpleUniqueParam
  ): Promise<
    ConcreteResult<Option<SolicitationCode>, SomePrismaError | BasicError>
  > {
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
