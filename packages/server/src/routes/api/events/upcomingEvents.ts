import type { Context } from "koa";
import { DateTime } from "luxon";
import type { NextFn } from "type-graphql";
import { Container } from "typedi";

import { FileManager } from "../../../lib/files/FileManager.js";
import { combineMimePartsToString } from "../../../lib/files/mime.js";
import { EventRepository } from "../../../repositories/event/EventRepository.js";

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
        event.eventImages.map(async ({ image }) => ({
          url: await fileManager.getExternalUrl(image.file),
          alt: image.alt ?? null,
          mimeType: combineMimePartsToString(
            image.file.mimeTypeName,
            image.file.mimeSubtypeName,
            image.file.mimeParameters
          ),
          thumbHash: image.thumbHash?.toString("base64") ?? null,
          width: image.width,
          height: image.height,
        }))
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
