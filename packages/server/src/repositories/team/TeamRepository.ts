import { Prisma, PrismaClient } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildTeamWhere } from "./teamRepositoryUtils.js";

const teamBooleanKeys = [] as const;
type TeamBooleanKey = (typeof teamBooleanKeys)[number];

const teamDateKeys = ["createdAt", "updatedAt"] as const;
type TeamDateKey = (typeof teamDateKeys)[number];

const teamIsNullKeys = [] as const;
type TeamIsNullKey = (typeof teamIsNullKeys)[number];

const teamNumericKeys = ["totalPoints"] as const;
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

  listTeams({
    filters,
    order,
    skip,
    take,
    onlyDemo,
  }: {
    filters?: readonly TeamFilters[] | undefined | null;
    order?:
      | readonly [key: TeamOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
    onlyDemo?: boolean;
  }) {
    const wheres = buildTeamWhere(filters);

    const orders: Prisma.Sql[] = [];
    for (const [key, sort] of order ?? []) {
      orders.push(
        Prisma.sql`${key} ${sort === SortDirection.ASCENDING ? "asc" : "desc"}`
      );
    }

    return this.prisma.$queryRaw`SELECT * FROM team WHERE ${wheres.join(
      " AND "
    )} ORDER BY ${orders}.join(", ") LIMIT ${take} OFFSET ${skip}`;
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
