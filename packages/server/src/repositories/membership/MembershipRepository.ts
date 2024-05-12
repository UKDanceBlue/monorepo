import { Prisma, PrismaClient } from "@prisma/client";
import type {
  MembershipPositionType,
  SortDirection,
} from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { SimpleUniqueParam } from "../shared.js";

import {
  buildMembershipOrder,
  buildMembershipWhere,
} from "./membershipRepositoryUtils.js";

const membershipBooleanKeys = [] as const;
type MembershipBooleanKey = (typeof membershipBooleanKeys)[number];

const membershipDateKeys = ["createdAt", "updatedAt"] as const;
type MembershipDateKey = (typeof membershipDateKeys)[number];

const membershipIsNullKeys = [] as const;
type MembershipIsNullKey = (typeof membershipIsNullKeys)[number];

const membershipNumericKeys = [] as const;
type MembershipNumericKey = (typeof membershipNumericKeys)[number];

const membershipOneOfKeys = [] as const;
type MembershipOneOfKey = (typeof membershipOneOfKeys)[number];

const membershipStringKeys = [] as const;
type MembershipStringKey = (typeof membershipStringKeys)[number];

export type MembershipFilters = FilterItems<
  MembershipBooleanKey,
  MembershipDateKey,
  MembershipIsNullKey,
  MembershipNumericKey,
  MembershipOneOfKey,
  MembershipStringKey
>;

type UniqueMembershipParam = { id: number } | { uuid: string };

@Service()
export class MembershipRepository {
  constructor(private prisma: PrismaClient) {}

  findMembershipByUnique(
    param: UniqueMembershipParam,
    include: Prisma.MembershipInclude
  ) {
    return this.prisma.membership.findUnique({ where: param, include });
  }

  listMemberships({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly MembershipFilters[] | undefined | null;
    order?: readonly [key: string, sort: SortDirection][] | undefined | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildMembershipWhere(filters);
    const orderBy = buildMembershipOrder(order);

    return this.prisma.membership.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countMemberships({
    filters,
  }: {
    filters?: readonly MembershipFilters[] | undefined | null;
  }) {
    const where = buildMembershipWhere(filters);

    return this.prisma.membership.count({
      where,
    });
  }

  createMembership(data: Prisma.MembershipCreateInput) {
    return this.prisma.membership.create({ data });
  }

  updateMembership(
    param: UniqueMembershipParam,
    data: Prisma.MembershipUpdateInput
  ) {
    try {
      return this.prisma.membership.update({ where: param, data });
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

  private async lookupPersonAndTeamId(
    personParam: SimpleUniqueParam,
    teamParam: SimpleUniqueParam
  ) {
    let personId, teamId;
    if ("id" in personParam) {
      personId = personParam.id;
    } else if ("uuid" in personParam) {
      const found = await this.prisma.person.findUnique({
        where: { uuid: personParam.uuid },
        select: { id: true },
      });
      if (found == null) {
        return null;
      }
      personId = found.id;
    } else {
      // teamParam satisfies Record<string, never>;
      throw new Error("Must provide either UUID or ID");
    }
    if ("id" in teamParam) {
      teamId = teamParam.id;
    } else if ("uuid" in teamParam) {
      const found = await this.prisma.team.findUnique({
        where: teamParam,
        select: { id: true },
      });
      if (found == null) {
        return null;
      }
      teamId = found.id;
    } else {
      teamParam satisfies Record<string, never>;
      throw new Error("Must provide either UUID or ID");
    }

    return { personId, teamId };
  }

  async assignPersonToTeam(
    personParam: SimpleUniqueParam,
    teamParam: SimpleUniqueParam,
    position: MembershipPositionType
  ) {
    const result = await this.lookupPersonAndTeamId(personParam, teamParam);
    if (result == null) {
      return null;
    }
    const { personId, teamId } = result;

    return this.prisma.membership.upsert({
      where: {
        personId_teamId: {
          personId,
          teamId,
        },
        team: {
          correspondingCommitteeId: null,
        },
      },
      create: {
        person: {
          connect: {
            id: personId,
          },
        },
        team: {
          connect: {
            id: teamId,
          },
        },
        position,
      },
      update: {},
    });
  }

  async removePersonFromTeam(
    personParam: SimpleUniqueParam,
    teamParam: SimpleUniqueParam
  ) {
    const result = await this.lookupPersonAndTeamId(personParam, teamParam);
    if (result == null) {
      return null;
    }
    const { personId, teamId } = result;

    return this.prisma.membership.delete({
      where: {
        personId_teamId: {
          personId,
          teamId,
        },
      },
    });
  }

  deleteMembership(param: UniqueMembershipParam) {
    try {
      return this.prisma.membership.delete({ where: param });
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
