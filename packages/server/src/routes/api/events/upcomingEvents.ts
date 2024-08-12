import { DateTime } from "luxon";
import { Container } from "typedi";

import type { Context } from "koa";
import type { NextFn } from "type-graphql";


import { FileManager } from "#files/FileManager.js";
import { combineMimePartsToString } from "#files/mime.js";
import { EventRepository } from "#repositories/event/EventRepository.js";

const EMPTY_PNG_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NgAAIAAAUAAR4f7BQAAAAASUVORK5CYII=";

export const upcomingEventsHandler = async (ctx: Context, next: NextFn) => {
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

  const upcomingEvents = await Container.get(EventRepository).getUpcomingEvents(
    {
      count: eventsToSend,
      until,
    }
  );

  const fileManager = Container.get(FileManager);

  const eventsJson = await Promise.all(
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
            const externalUrl = await fileManager.getExternalUrl(image.file);
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
            ...fileData,
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
};
