
import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
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

const teamOneOfKeys = [] as const;
type TeamOneOfKey = (typeof teamOneOfKeys)[number];

const teamStringKeys = [] as const;
type TeamStringKey = (typeof teamStringKeys)[number];

export type TeamFilters = FilterItems<
  TeamBooleanKey,
  TeamDateKey,
  TeamIsNullKey,
  TeamNumericKey,
  TeamOneOfKey,
  TeamStringKey
>;

type UniqueTeamParam = { id: number } | { uuid: string };

@Service()
export class TeamRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}

    findTeamByUnique(param: UniqueTeamParam) {
      return this.prisma.team.findUnique({where: param});
    }

    listTeam({
      filters,
      order,
      skip,
      take,
    }: {
      filters?: readonly TeamFilters[] | undefined | null;
      order?: readonly [key: string, sort: SortDirection][] | undefined | null;
      skip?: number | undefined | null;
      take?: number | undefined | null;
    }) {
      const where = buildTeamWhere(filters);
      const orderBy = buildTeamOrder(order);

      return this.prisma.team.findMany({
        where,
        orderBy,
        skip: skip ?? undefined,
        take: take ?? undefined,
      });
    }

    countTeam({
      filters,
    }: {
      filters?: readonly TeamFilters[] | undefined | null;
    }) {
      const where = buildTeamWhere(filters);

      return this.prisma.team.count({
        where,
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