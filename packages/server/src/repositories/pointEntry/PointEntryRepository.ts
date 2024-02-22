
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildPointEntryOrder, buildPointEntryWhere } from "./pointEntryRepositoryUtils.js";

const pointEntryBooleanKeys = [] as const;
type PointEntryBooleanKey = (typeof pointEntryBooleanKeys)[number];

const pointEntryDateKeys = ["createdAt", "updatedAt"] as const;
type PointEntryDateKey = (typeof pointEntryDateKeys)[number];

const pointEntryIsNullKeys = [] as const;
type PointEntryIsNullKey = (typeof pointEntryIsNullKeys)[number];

const pointEntryNumericKeys = [] as const;
type PointEntryNumericKey = (typeof pointEntryNumericKeys)[number];

const pointEntryOneOfKeys = [] as const;
type PointEntryOneOfKey = (typeof pointEntryOneOfKeys)[number];

const pointEntryStringKeys = [] as const;
type PointEntryStringKey = (typeof pointEntryStringKeys)[number];

export type PointEntryFilters = FilterItems<
  PointEntryBooleanKey,
  PointEntryDateKey,
  PointEntryIsNullKey,
  PointEntryNumericKey,
  PointEntryOneOfKey,
  PointEntryStringKey
>;

@Service()
export class PointEntryRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}