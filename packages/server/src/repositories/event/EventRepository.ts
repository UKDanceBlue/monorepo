
import { Prisma, PrismaClient } from "@prisma/client";
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

type UniqueEventParam = { id: number } | { uuid: string };

@Service()
export class EventRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}

    findEventByUnique(param: UniqueEventParam) {
      return this.prisma.event.findUnique({where: param});
    }

    listEvent({
      filters,
      order,
      skip,
      take,
    }: {
      filters?: readonly EventFilters[] | undefined | null;
      order?: readonly [key: string, sort: SortDirection][] | undefined | null;
      skip?: number | undefined | null;
      take?: number | undefined | null;
    }) {
      const where = buildEventWhere(filters);
      const orderBy = buildEventOrder(order);

      return this.prisma.event.findMany({
        where,
        orderBy,
        skip: skip ?? undefined,
        take: take ?? undefined,
      });
    }

    countEvent({
      filters,
    }: {
      filters?: readonly EventFilters[] | undefined | null;
    }) {
      const where = buildEventWhere(filters);

      return this.prisma.event.count({
        where,
      });
    }

    createEvent(data: Prisma.EventCreateInput) {
      return this.prisma.event.create({ data });
    }

    updateEvent(param: UniqueEventParam, data: Prisma.EventUpdateInput) {
      try {
        return this.prisma.event.update({ where: param, data });
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

    deleteEvent(param: UniqueEventParam) {
      try {
        return this.prisma.event.delete({ where: param });
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