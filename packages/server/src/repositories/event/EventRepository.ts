import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildEventOrder, buildEventWhere } from "./eventRepositoryUtils.js";

const eventBooleanKeys = [] as const;
type EventBooleanKey = (typeof eventBooleanKeys)[number];

const eventDateKeys = [
  "createdAt",
  "updatedAt",
  "occurrence",
  "occurrenceStart",
  "occurrenceEnd",
] as const;
type EventDateKey = (typeof eventDateKeys)[number];

const eventIsNullKeys = [] as const;
type EventIsNullKey = (typeof eventIsNullKeys)[number];

const eventNumericKeys = [] as const;
type EventNumericKey = (typeof eventNumericKeys)[number];

const eventOneOfKeys = [] as const;
type EventOneOfKey = (typeof eventOneOfKeys)[number];

const eventStringKeys = [
  "title",
  "summary",
  "description",
  "location",
] as const;
type EventStringKey = (typeof eventStringKeys)[number];

export type EventOrderKeys =
  | "title"
  | "description"
  | "summary"
  | "location"
  | "occurrence"
  | "occurrenceStart"
  | "occurrenceEnd"
  | "createdAt"
  | "updatedAt";

export type EventFilters = FilterItems<
  EventBooleanKey,
  EventDateKey,
  EventIsNullKey,
  EventNumericKey,
  EventOneOfKey,
  EventStringKey
>;

type UniqueEventParam = { id: number } | { uuid: string };

import { prismaToken } from "#prisma";

@Service([prismaToken])
export class EventRepository {
  constructor(private prisma: PrismaClient) {}

  findEventByUnique(param: UniqueEventParam) {
    return this.prisma.event.findUnique({
      where: param,
      include: { eventOccurrences: true },
    });
  }

  async listEvents({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly EventFilters[] | undefined | null;
    order?:
      | readonly [key: EventOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildEventWhere(filters);
    const orderBy = buildEventOrder(order);

    let rows = await this.prisma.event.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
      include: { eventOccurrences: true },
    });

    rows = rows.map((row) => {
      row.eventOccurrences.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      });
      return row;
    });

    for (const [key, sort] of order ?? []) {
      switch (key) {
        case "occurrence":
        case "occurrenceStart": {
          rows.sort((a, b) => {
            const aDate = a.eventOccurrences[0]?.date ?? new Date(0);
            const bDate = b.eventOccurrences[0]?.date ?? new Date(0);
            return sort === SortDirection.asc
              ? aDate.getTime() - bDate.getTime()
              : bDate.getTime() - aDate.getTime();
          });
          break;
        }
        case "occurrenceEnd": {
          rows.sort((a, b) => {
            const aDate = a.eventOccurrences.at(-1)?.date ?? new Date(0);
            const bDate = b.eventOccurrences.at(-1)?.date ?? new Date(0);
            return sort === SortDirection.asc
              ? aDate.getTime() - bDate.getTime()
              : bDate.getTime() - aDate.getTime();
          });
          break;
        }
      }
    }

    return rows;
  }

  countEvents({
    filters,
  }: {
    filters?: readonly EventFilters[] | undefined | null;
  }) {
    const where = buildEventWhere(filters);

    return this.prisma.event.count({
      where,
    });
  }

  async getUpcomingEvents({ count, until }: { count: number; until: Date }) {
    const rows = await this.prisma.event.findMany({
      where: {
        eventOccurrences: {
          some: {
            date: {
              gte: new Date(),
              lte: until,
            },
          },
        },
      },
      take: count,
      include: {
        eventOccurrences: true,
        eventImages: {
          include: {
            image: {
              include: {
                file: true,
              },
            },
          },
        },
      },
    });

    return rows
      .map((row) => {
        row.eventOccurrences.sort((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });
        return row;
      })
      .sort((a, b) => {
        const aDate = a.eventOccurrences[0]?.date ?? new Date(0);
        const bDate = b.eventOccurrences[0]?.date ?? new Date(0);
        return aDate.getTime() - bDate.getTime();
      });
  }

  createEvent(data: Prisma.EventCreateInput) {
    return this.prisma.event.create({
      data,
      include: { eventOccurrences: true },
    });
  }

  updateEvent(param: UniqueEventParam, data: Prisma.EventUpdateInput) {
    try {
      return this.prisma.event.update({
        where: param,
        data,
        include: { eventOccurrences: true },
      });
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
