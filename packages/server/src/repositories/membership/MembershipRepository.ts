import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

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

  findMembershipByUnique(param: UniqueMembershipParam) {
    return this.prisma.membership.findUnique({ where: param });
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
