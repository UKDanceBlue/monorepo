import { Service } from "@freshgum/typedi";
import { Event, EventOccurrence, Prisma, PrismaClient } from "@prisma/client";

type UniqueEventParam = { id: number } | { uuid: string };

import type { DefaultArgs } from "@prisma/client/runtime/library";
import { ConcreteError, InvalidArgumentError } from "@ukdanceblue/common/error";
import { Err, Ok, Result } from "ts-results-es";

import { externalUrlToImage } from "#lib/external-apis/externalUrlToImage.js";
import { prismaToken } from "#lib/typediTokens.js";
import {
  buildDefaultRepository,
  type CreateParams,
  type CreateResult,
  type DeleteParams,
  type DeleteResult,
  type FindAndCountParams,
  type FindAndCountResult,
  type FindOneParams,
  type FindOneResult,
} from "#repositories/Default.js";
import {
  type AsyncRepositoryResult,
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

type EventFilterKeys =
  | "title"
  | "summary"
  | "description"
  | "location"
  | "occurrence"
  | "occurrenceStart"
  | "occurrenceEnd"
  | "createdAt"
  | "updatedAt";

@Service([prismaToken])
export class EventRepository extends buildDefaultRepository<
  PrismaClient["event"],
  UniqueEventParam,
  EventFilterKeys,
  {
    eventOccurrences: true;
  }
>("Event", {
  title: {
    getOrderBy: (order) =>
      Ok({
        title: order,
      }),
    getWhere: (value) =>
      Ok({
        title: value,
      }),
  },
  summary: {
    getOrderBy: (order) =>
      Ok({
        summary: order,
      }),
    getWhere: (value) =>
      Ok({
        summary: value,
      }),
  },
  description: {
    getOrderBy: (order) =>
      Ok({
        description: order,
      }),
    getWhere: (value) =>
      Ok({
        description: value,
      }),
  },
  location: {
    getOrderBy: (order) =>
      Ok({
        location: order,
      }),
    getWhere: (value) =>
      Ok({
        location: value,
      }),
  },
  get occurrence() {
    return this.occurrenceStart;
  },
  // See https://github.com/prisma/prisma/issues/5837
  occurrenceStart: {
    getOrderBy: () =>
      Err(new InvalidArgumentError("Cannot order by occurrenceStart")),
    getWhere: (value) =>
      Ok({
        eventOccurrences: {
          some: {
            date: value,
          },
        },
      }),
  },
  occurrenceEnd: {
    getOrderBy: () =>
      Err(new InvalidArgumentError("Cannot order by occurrenceEnd")),
    getWhere: (value) =>
      Ok({
        eventOccurrences: {
          some: {
            endDate: value,
          },
        },
      }),
  },
  createdAt: {
    getOrderBy: (order) =>
      Ok({
        createdAt: order,
      }),
    getWhere: (value) =>
      Ok({
        createdAt: value,
      }),
  },
  updatedAt: {
    getOrderBy: (order) =>
      Ok({
        updatedAt: order,
      }),
    getWhere: (value) =>
      Ok({
        updatedAt: value,
      }),
  },
}) {
  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);
  }

  public uniqueToWhere(by: UniqueEventParam): Prisma.EventWhereUniqueInput {
    return EventRepository.simpleUniqueToWhere(by);
  }

  findOne({
    by,
    tx,
  }: FindOneParams<UniqueEventParam>): AsyncRepositoryResult<
    FindOneResult<
      Prisma.EventDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: { eventOccurrences: true } }
    >
  > {
    return this.handleQueryError(
      (tx ?? this.prisma).event.findUnique({
        where: this.uniqueToWhere(by),
        include: { eventOccurrences: true },
      }),
      { what: "event", where: "EventRepository.findOne" }
    );
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<EventFilterKeys>): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.EventDelegate<DefaultArgs, Prisma.PrismaClientOptions>
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).event.findMany({
            ...params,
            include: { eventOccurrences: true },
          })
        )
          .map((rows) => ({ rows, params }))
          .map(({ rows, params }) => ({
            rows: rows.map((row) => {
              row.eventOccurrences.sort((a, b) => {
                return a.date.getTime() - b.date.getTime();
              });
              return row;
            }),
            params,
          }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError((tx ?? this.prisma).event.count(params)).map(
          (total) => ({
            selectedRows: rows,
            total,
          })
        )
      );
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

  create({
    init,
    tx,
  }: CreateParams<
    Prisma.EventDelegate<DefaultArgs, Prisma.PrismaClientOptions>
  >): AsyncRepositoryResult<
    CreateResult<Prisma.EventDelegate<DefaultArgs, Prisma.PrismaClientOptions>>
  > {
    return this.handleQueryError(
      (tx ?? this.prisma).event.create({
        data: init,
        include: { eventOccurrences: true },
      })
    );
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

  delete({
    by,
    tx,
  }: DeleteParams<UniqueEventParam>): AsyncRepositoryResult<
    DeleteResult<Prisma.EventDelegate<DefaultArgs, Prisma.PrismaClientOptions>>
  > {
    return this.handleQueryError(
      (tx ?? this.prisma).event.delete({
        where: this.uniqueToWhere(by),
        include: { eventOccurrences: true },
      })
    );
  }
}
