import { Prisma, PrismaClient } from "@prisma/client";
import type {
  MarathonYearString,
  SortDirection,
  TeamType,
} from "@ukdanceblue/common";
import { TeamLegacyStatus } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { UniqueMarathonParam } from "../marathon/MarathonRepository.js";
import type { SimpleUniqueParam } from "../shared.js";

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

@Service()
export class TeamRepository {
  constructor(private prisma: PrismaClient) {}

  findTeamByUnique(param: SimpleUniqueParam) {
    return this.prisma.team.findUnique({ where: param });
  }

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
        marathon: makeMarathonWhere(marathon ?? []),

        ...where,
        legacyStatus: legacyStatus
          ? { in: legacyStatus }
          : where.legacyStatus ??
            (onlyDemo
              ? {
                  equals: TeamLegacyStatus.DemoTeam,
                }
              : {
                  not: TeamLegacyStatus.DemoTeam,
                }),
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
          : where.legacyStatus ??
            (onlyDemo
              ? {
                  equals: TeamLegacyStatus.DemoTeam,
                }
              : {
                  not: TeamLegacyStatus.DemoTeam,
                }),
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

  getTeamPointEntries(param: SimpleUniqueParam) {
    return this.prisma.pointEntry.findMany({
      where: {
        team: param,
      },
    });
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
}
