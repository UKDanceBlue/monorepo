import { Service } from "@freshgum/typedi";
import type { Context } from "koa";
import { DateTime } from "luxon";
import type { NextFn } from "type-graphql";

import { FileManager } from "#files/FileManager.js";
import { combineMimePartsToString } from "#files/mime.js";
import { EventRepository } from "#repositories/event/EventRepository.js";
import { RouterService } from "#routes/RouteService.js";

interface UpcomingEvent {
  title: string;
  summary: string | null;
  description: string | null;
  location: string | null;
  occurrences: {
    start: Date;
    end: Date;
  }[];
  images: {
    url: string;
    mimeType: string;
    width: number;
    height: number;
    alt: string | null;
    thumbHash: string | null;
  }[];
}

const EMPTY_PNG_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=";

@Service([EventRepository, FileManager])
export default class EventsRouter extends RouterService {
  constructor(eventRepository: EventRepository, fileManager: FileManager) {
    super("/events");

    this.addGetRoute("/upcoming", async (ctx: Context, next: NextFn) => {
      let eventsToSend = 10;
      if (ctx.query.count) {
        const parsedCountParam =
          typeof ctx.query.count === "string"
            ? Number.parseInt(ctx.query.count, 10)
            : Number.parseInt(String(ctx.query.count[0]), 10);
        if (!Number.isNaN(parsedCountParam)) {
          eventsToSend = parsedCountParam;
        }
      }
      let until = DateTime.now().plus({ years: 1 }).toJSDate();
      if (ctx.query.until) {
        const parsedUntilParam =
          typeof ctx.query.until === "string"
            ? DateTime.fromISO(ctx.query.until)
            : DateTime.fromISO(String(ctx.query.until[0]));
        if (parsedUntilParam.isValid) {
          until = parsedUntilParam.toJSDate();
        }
      }

      const upcomingEvents = await eventRepository.getUpcomingEvents({
        count: eventsToSend,
        until,
      });

      const eventsJson: UpcomingEvent[] = await Promise.all(
        upcomingEvents.map(async (event) => {
          const occurrences = event.eventOccurrences;

          const images = await Promise.all(
            event.eventImages.map(async ({ image }) => {
              let fileData:
                | {
                    url: URL;
                    mimeType: string;
                    width?: number;
                    height?: number;
                  }
                | undefined = undefined;

              if (image.file) {
                const externalUrl = await fileManager.getExternalUrl(
                  image.file
                );
                if (externalUrl) {
                  fileData = {
                    url: externalUrl,
                    mimeType: combineMimePartsToString(
                      image.file.mimeTypeName,
                      image.file.mimeSubtypeName,
                      image.file.mimeParameters
                    ),
                  };
                }
              }
              if (!fileData) {
                fileData = {
                  url: new URL(EMPTY_PNG_URL),
                  mimeType: "image/png",
                  width: 1,
                  height: 1,
                };
              }

              return {
                alt: image.alt ?? null,
                thumbHash: image.thumbHash?.toString("base64") ?? null,
                width: image.width,
                height: image.height,
                url: fileData.url.toString(),
                mimeType: fileData.mimeType,
              };
            })
          );
          return {
            title: event.title,
            summary: event.summary,
            description: event.description,
            location: event.location,
            occurrences: occurrences.map((occurrence) => ({
              start: occurrence.date,
              end: occurrence.endDate,
            })),
            images,
          };
        })
      );

      ctx.body = eventsJson;
      ctx.type = "application/json";

      await next();
    });
  }
}
