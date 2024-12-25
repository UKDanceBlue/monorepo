import { Service } from "@freshgum/typedi";
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

import { ConcreteError } from "@ukdanceblue/common/error";
import { Ok, Result } from "ts-results-es";

import { externalUrlToImage } from "#lib/external-apis/externalUrlToImage.js";
import { drizzleToken } from "#lib/typediTokens.js";
import {
  handleRepositoryError,
  RepositoryError,
} from "#repositories/shared.js";

export interface ForeignEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  url: URL;
  startsOn?: Date | string;
  endsOn?: Date | string;
  imageUrls: URL[];
}

@Service([drizzleToken])
export class EventRepository {
  constructor(protected readonly db: Drizzle) {}

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

  loadForeignEvents(
    events: ForeignEvent[]
  ): Promise<Result<Event[], ConcreteError>> {
    const results: Event[] = [];
    return this.prisma.$transaction(async (prisma) => {
      for (const event of events) {
        // eslint-disable-next-line no-await-in-loop
        const existingEvent = await prisma.event.findUnique({
          where: { remoteId: event.id },
        });

        if (existingEvent) {
          continue;
        }

        const images = Result.all(
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(event.imageUrls.map(externalUrlToImage))
        );

        if (images.isErr()) {
          return images;
        }

        results.push(
          // eslint-disable-next-line no-await-in-loop
          await prisma.event.create({
            data: {
              title: event.title,
              description: `${event.description}\n\n[More info](${event.url.href})`,
              location: event.location,
              remoteId: event.id,
              eventOccurrences:
                event.startsOn && event.endsOn
                  ? {
                      create: {
                        date: event.startsOn,
                        endDate: event.endsOn,
                      },
                    }
                  : undefined,
              eventImages: {
                create: images
                  .unwrap()
                  .map(({ height, mimeType, thumbHash, url, width }) => ({
                    image: {
                      create: {
                        height,
                        width,
                        thumbHash,
                        file: {
                          create: {
                            filename: url.pathname.split("/").at(-1) ?? "",
                            locationUrl: url.href,
                            mimeSubtypeName: mimeType.subtype,
                            mimeTypeName: mimeType.type,
                            mimeParameters:
                              mimeType.params.keys.length > 0
                                ? {
                                    set: [...mimeType.params.entries()].map(
                                      ([k, v]) => `${k}=${v}`
                                    ),
                                  }
                                : undefined,
                          },
                        },
                      },
                    },
                  })),
              },
            },
          })
        );
      }

      return Ok(results);
    });
  }

  async updateEvent(
    param: UniqueEventParam,
    data: {
      title: string;
      summary: string | null;
      description: string | null;
      location: string | null;
      eventOccurrences: {
        uuid?: string;
        interval: {
          start: Date | string;
          end: Date | string;
        };
        fullDay: boolean;
      }[];
    }
  ): Promise<
    Result<Event & { eventOccurrences: EventOccurrence[] }, RepositoryError>
  > {
    try {
      return Ok(
        await this.prisma.$transaction(async (prisma) => {
          await prisma.eventOccurrence.deleteMany({
            where: {
              event: param,
              uuid: {
                notIn: data.eventOccurrences
                  .filter((occurrence) => occurrence.uuid != null)
                  .map((occurrence) => occurrence.uuid!),
              },
            },
          });
          return prisma.event.update({
            where: param,
            include: { eventOccurrences: true },
            data: {
              title: data.title,
              summary: data.summary,
              description: data.description,
              location: data.location,
              eventOccurrences: {
                createMany: {
                  data: data.eventOccurrences
                    .filter((occurrence) => occurrence.uuid == null)
                    .map(
                      (
                        occurrence
                      ): Prisma.EventOccurrenceCreateManyEventInput => ({
                        date: occurrence.interval.start,
                        endDate: occurrence.interval.end,
                        fullDay: occurrence.fullDay,
                      })
                    ),
                },
                updateMany: data.eventOccurrences
                  .filter((occurrence) => occurrence.uuid != null)
                  .map(
                    (
                      occurrence
                    ): Prisma.EventOccurrenceUpdateManyWithWhereWithoutEventInput => ({
                      where: { uuid: occurrence.uuid },
                      data: {
                        date: occurrence.interval.start,
                        endDate: occurrence.interval.end,
                        fullDay: occurrence.fullDay,
                      },
                    })
                  ),
              },
            },
          });
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  deleteEvent(param: UniqueEventParam) {
    try {
      return this.prisma.event.delete({
        where: param,
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
}
