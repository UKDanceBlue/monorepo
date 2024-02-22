
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildMembershipOrder, buildMembershipWhere } from "./membershipRepositoryUtils.js";

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

@Service()
export class MembershipRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}