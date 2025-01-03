import { Service } from "@freshgum/typedi";
import { Event, Prisma, PrismaClient } from "@prisma/client";

type UniqueEventParam = { id: number } | { uuid: string };

import type { DefaultArgs } from "@prisma/client/runtime/library";
import type {
  FieldsOfListQueryArgs,
  ListEventsArgs,
} from "@ukdanceblue/common";
import { type FetchError, LuxonError } from "@ukdanceblue/common/error";
import type { Interval } from "luxon";
import { AsyncResult, Ok, Result } from "ts-results-es";

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
  type UpdateParams,
  type UpdateResult,
} from "#repositories/Default.js";
import { type AsyncRepositoryResult } from "#repositories/shared.js";

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

type EventFilterKeys = FieldsOfListQueryArgs<ListEventsArgs>;

const defaultOptions = { include: { eventOccurrences: true } } as const;

@Service([prismaToken])
export class EventRepository extends buildDefaultRepository<
  PrismaClient["eventWithOccurrences"],
  UniqueEventParam,
  EventFilterKeys,
  (typeof defaultOptions)["include"]
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
  occurrences: {
    getOrderBy: (order) =>
      Ok({
        firstOccurrence: order,
      }),
    getWhere: (value) =>
      Ok({
        eventOccurrences: {
          some: {
            endDate: value,
          },
        },
      }),
  },
  // See https://github.com/prisma/prisma/issues/5837 for why we have to use the view property
  start: {
    getOrderBy: (order) =>
      Ok({
        firstOccurrence: order,
      }),
    getWhere: (value) =>
      Ok({
        firstOccurrence: value,
      }),
  },
  end: {
    getOrderBy: (order) =>
      Ok({
        lastOccurrence: order,
      }),
    getWhere: (value) =>
      Ok({
        lastOccurrence: value,
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

  public uniqueToWhere(
    by: UniqueEventParam
  ): Prisma.EventWithOccurrencesWhereUniqueInput &
    Prisma.EventWhereUniqueInput {
    return EventRepository.simpleUniqueToWhere(by);
  }

  findOne({
    by,
    tx,
  }: FindOneParams<UniqueEventParam>): AsyncRepositoryResult<
    FindOneResult<
      Prisma.EventWithOccurrencesDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      typeof defaultOptions
    >
  > {
    return this.handleQueryError(
      (tx ?? this.prisma).eventWithOccurrences.findUnique({
        ...defaultOptions,
        where: this.uniqueToWhere(by),
      }),
      { what: "event", where: "EventRepository.findOne" }
    );
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<EventFilterKeys>): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.EventWithOccurrencesDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      typeof defaultOptions
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).eventWithOccurrences.findMany({
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
        this.handleQueryError(
          (tx ?? this.prisma).eventWithOccurrences.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
  }

  getUpcomingEvents({ count, until }: { count: number; until: Date }) {
    return this.handleQueryError(
      this.prisma.event.findMany({
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
      })
    ).map((rows) =>
      rows
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
        })
    );
  }

  create({
    init,
    tx,
  }: CreateParams<{
    title: string;
    summary: string | null;
    description: string | null;
    location: string | null;
    eventOccurrences: {
      interval: Interval;
      fullDay: boolean;
    }[];
    eventImages?: {
      connect: { id: number }[];
    };
  }>): AsyncRepositoryResult<
    CreateResult<
      Prisma.EventWithOccurrencesDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      typeof defaultOptions
    >
  > {
    const eventOccurrences = Result.all(
      init.eventOccurrences.map(({ interval, ...other }) =>
        LuxonError.luxonObjectToResult(interval).map(
          (interval: Interval<true>) => ({ interval, ...other })
        )
      )
    );

    return eventOccurrences
      .toAsyncResult()
      .andThen((eventOccurrences) =>
        this.handleQueryError(
          (tx ?? this.prisma).event.create({
            data: {
              ...init,
              eventOccurrences: {
                createMany: {
                  data: eventOccurrences.map(({ interval, fullDay }) => ({
                    date: interval.start.toISO(),
                    endDate: interval.end.toISO(),
                    fullDay,
                  })),
                },
              },
              eventImages: init.eventImages && {
                createMany: {
                  data: init.eventImages.connect.map(({ id }) => ({
                    imageId: id,
                  })),
                },
              },
            },
          })
        )
      )
      .andThen((event) => this.findOne({ by: { id: event.id }, tx }));
  }

  loadForeignEvents(
    events: ForeignEvent[]
  ): AsyncRepositoryResult<Event[], FetchError> {
    return new AsyncResult(
      Promise.all(
        events.map(
          (event) =>
            new AsyncResult(
              Promise.all(
                event.imageUrls.map((url) => externalUrlToImage(url))
              ).then((images) => Result.all(images))
            ).map((images) => ({
              images,
              event,
            })).promise
        )
      ).then((results) => Result.all(results))
    ).andThen((results) =>
      this.handleQueryError(
        this.prisma.event.createManyAndReturn({
          data: results.map(({ images, event }) => ({
            title: event.title,
            description: `${event.description}\n\n[More info](${event.url.href})`,
            location: event.location,
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
              create: images.map(
                ({ height, mimeType, thumbHash, url, width }) => ({
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
                })
              ),
            },
          })),
        })
      )
    );
  }

  update({
    by,
    init,
    tx,
  }: UpdateParams<
    UniqueEventParam,
    {
      title?: string;
      summary?: string | null;
      description?: string | null;
      location?: string | null;
      eventOccurrences: {
        uuid?: string;
        interval: Interval;
        fullDay: boolean;
      }[];
    }
  >): AsyncRepositoryResult<
    UpdateResult<
      Prisma.EventWithOccurrencesDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      typeof defaultOptions
    >
  > {
    const eventOccurrences = Result.all(
      init.eventOccurrences.map(({ interval, ...other }) =>
        LuxonError.luxonObjectToResult(interval).map(
          (interval: Interval<true>) => ({ interval, ...other })
        )
      )
    );
    return eventOccurrences
      .toAsyncResult()
      .andThen((eventOccurrences) =>
        this.handleTransactionError(
          (tx) =>
            this.handleQueryError(
              tx.eventOccurrence.deleteMany({
                where: {
                  event: this.uniqueToWhere(by),
                  uuid: {
                    notIn: init.eventOccurrences
                      .filter((occurrence) => occurrence.uuid != null)
                      .map((occurrence) => occurrence.uuid!),
                  },
                },
              })
            ).andThen(() =>
              this.handleQueryError(
                tx.event.update({
                  include: { eventOccurrences: true },
                  where: this.uniqueToWhere(by),
                  data: {
                    ...init,
                    eventOccurrences: {
                      createMany: {
                        data: eventOccurrences
                          .filter((occurrence) => occurrence.uuid == null)
                          .map(
                            (
                              occurrence
                            ): Prisma.EventOccurrenceCreateManyEventWithOccurrencesInput => ({
                              date: occurrence.interval.start.toISO(),
                              endDate: occurrence.interval.end.toISO(),
                              fullDay: occurrence.fullDay,
                            })
                          ),
                      },
                      updateMany: eventOccurrences
                        .filter((occurrence) => occurrence.uuid != null)
                        .map(
                          (
                            occurrence
                          ): Prisma.EventOccurrenceUpdateManyWithWhereWithoutEventInput => ({
                            where: { uuid: occurrence.uuid },
                            data: {
                              date: occurrence.interval.start.toISO(),
                              endDate: occurrence.interval.end.toISO(),
                              fullDay: occurrence.fullDay,
                            },
                          })
                        ),
                    },
                  },
                })
              )
            ),
          tx
        )
      )
      .andThen((event) => this.findOne({ by: { id: event.id }, tx }));
  }

  delete({
    by,
    tx,
  }: DeleteParams<UniqueEventParam>): AsyncRepositoryResult<
    DeleteResult<
      Prisma.EventWithOccurrencesDelegate<
        DefaultArgs,
        Prisma.PrismaClientOptions
      >,
      typeof defaultOptions
    >
  > {
    return this.handleQueryError(
      (tx ?? this.prisma).event.delete({
        where: this.uniqueToWhere(by),
        include: { eventOccurrences: true },
      })
    ).andThen((event) => this.findOne({ by: { id: event.id }, tx }));
  }
}
