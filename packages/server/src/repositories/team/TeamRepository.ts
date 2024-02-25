import { Prisma, PrismaClient } from "@prisma/client";
import type { MarathonYearString, TeamType } from "@ukdanceblue/common";
import { SortDirection, TeamLegacyStatus } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildTeamOrder, buildTeamWhere } from "./teamRepositoryUtils.js";

const teamBooleanKeys = [] as const;
type TeamBooleanKey = (typeof teamBooleanKeys)[number];

const teamDateKeys = ["createdAt", "updatedAt"] as const;
type TeamDateKey = (typeof teamDateKeys)[number];

const teamIsNullKeys = [] as const;
type TeamIsNullKey = (typeof teamIsNullKeys)[number];

const teamNumericKeys = [] as const;
type TeamNumericKey = (typeof teamNumericKeys)[number];

const teamOneOfKeys = ["type", "marathonYear", "legacyStatus"] as const;
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
  | "marathonYear"
  | "legacyStatus"
  | "name"
  | "totalPoints";

type UniqueTeamParam = { id: number } | { uuid: string };

@Service()
export class TeamRepository {
  constructor(private prisma: PrismaClient) {}

  findTeamByUnique(param: UniqueTeamParam) {
    return this.prisma.team.findUnique({ where: param });
  }

  async listTeams({
    filters,
    order,
    skip,
    take,
    onlyDemo,
    legacyStatus,
    marathonYear,
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
    marathonYear?: MarathonYearString[] | undefined | null;
    type?: TeamType[] | undefined | null;
  }) {
    const where = buildTeamWhere(filters);
    const orderBy = buildTeamOrder(order);

    const rows = await this.prisma.team.findMany({
      where: {
        type: type ? { in: type } : undefined,
        marathonYear: marathonYear ? { in: marathonYear } : undefined,

        ...where,
        legacyStatus: legacyStatus
          ? { in: legacyStatus }
          : where.legacyStatus ??
            (onlyDemo
              ? {
                  notIn: [TeamLegacyStatus.DemoTeam],
                }
              : undefined),
      },
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });

    const totalPointsOrder = order?.find(([key]) => key === "totalPoints");

    return totalPointsOrder
      ? (
          await Promise.all(
            rows.map((row) =>
              this.getTotalTeamPoints({ id: row.id }).then((totalPoints) => ({
                ...row,
                totalPoints: totalPoints._sum.points ?? 0,
              }))
            )
          )
        )
          // eslint-disable-next-line unicorn/no-await-expression-member
          .sort((a, b) =>
            totalPointsOrder[1] === SortDirection.ASCENDING
              ? a.totalPoints - b.totalPoints
              : b.totalPoints - a.totalPoints
          )
      : rows;
  }

  countTeams({
    filters,
  }: {
    filters?: readonly TeamFilters[] | undefined | null;
  }) {
    const where = buildTeamWhere(filters);

    return this.prisma.team.count({
      where,
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

  getTotalTeamPoints(param: UniqueTeamParam) {
    return this.prisma.pointEntry.aggregate({
      _sum: {
        points: true,
      },
      where: {
        team: param,
      },
    });
  }

  getTeamPointEntries(param: UniqueTeamParam) {
    return this.prisma.pointEntry.findMany({
      where: {
        team: param,
      },
    });
  }

  createTeam(data: Prisma.TeamCreateInput) {
    return this.prisma.team.create({ data });
  }

  updateTeam(param: UniqueTeamParam, data: Prisma.TeamUpdateInput) {
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

  deleteTeam(param: UniqueTeamParam) {
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
