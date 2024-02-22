
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildPointOpportunityOrder, buildPointOpportunityWhere } from "./pointOpportunityRepositoryUtils.js";

const pointOpportunityBooleanKeys = [] as const;
type PointOpportunityBooleanKey = (typeof pointOpportunityBooleanKeys)[number];

const pointOpportunityDateKeys = ["createdAt", "updatedAt"] as const;
type PointOpportunityDateKey = (typeof pointOpportunityDateKeys)[number];

const pointOpportunityIsNullKeys = [] as const;
type PointOpportunityIsNullKey = (typeof pointOpportunityIsNullKeys)[number];

const pointOpportunityNumericKeys = [] as const;
type PointOpportunityNumericKey = (typeof pointOpportunityNumericKeys)[number];

const pointOpportunityOneOfKeys = [] as const;
type PointOpportunityOneOfKey = (typeof pointOpportunityOneOfKeys)[number];

const pointOpportunityStringKeys = [] as const;
type PointOpportunityStringKey = (typeof pointOpportunityStringKeys)[number];

export type PointOpportunityFilters = FilterItems<
  PointOpportunityBooleanKey,
  PointOpportunityDateKey,
  PointOpportunityIsNullKey,
  PointOpportunityNumericKey,
  PointOpportunityOneOfKey,
  PointOpportunityStringKey
>;

@Service()
export class PointOpportunityRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}