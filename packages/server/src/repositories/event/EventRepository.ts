
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildEventOrder, buildEventWhere } from "./eventRepositoryUtils.js";

const eventBooleanKeys = [] as const;
type EventBooleanKey = (typeof eventBooleanKeys)[number];

const eventDateKeys = ["createdAt", "updatedAt"] as const;
type EventDateKey = (typeof eventDateKeys)[number];

const eventIsNullKeys = [] as const;
type EventIsNullKey = (typeof eventIsNullKeys)[number];

const eventNumericKeys = [] as const;
type EventNumericKey = (typeof eventNumericKeys)[number];

const eventOneOfKeys = [] as const;
type EventOneOfKey = (typeof eventOneOfKeys)[number];

const eventStringKeys = [] as const;
type EventStringKey = (typeof eventStringKeys)[number];

export type EventFilters = FilterItems<
  EventBooleanKey,
  EventDateKey,
  EventIsNullKey,
  EventNumericKey,
  EventOneOfKey,
  EventStringKey
>;

@Service()
export class EventRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}