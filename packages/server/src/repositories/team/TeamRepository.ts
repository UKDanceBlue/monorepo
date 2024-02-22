
import { PrismaClient } from "@prisma/client";
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

@Service()
export class TeamRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}