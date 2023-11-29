import { Op } from "@sequelize/core";
import type { Context } from "koa";
import { DateTime } from "luxon";
import type { NextFn } from "type-graphql";

import { EventModel } from "../../../models/Event.js";
import { EventOccurrenceModel } from "../../../models/EventOccurrence.js";

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

  const upcomingEvents = await EventModel.withoutScope().findAll({
    order: [[EventOccurrenceModel, "date", "ASC"]],
    limit: eventsToSend,
    include: [
      {
        model: EventOccurrenceModel,
        where: {
          [Op.and]: {
            [Op.or]: [
              { date: { [Op.gte]: new Date() } },
              {
                [Op.and]: [
                  { date: { [Op.lte]: new Date() } },
                  { endDate: { [Op.gte]: new Date() } },
                ],
              },
            ],
            endDate: { [Op.lte]: until },
          },
        },
      },
    ],
  });

  const eventsJson = await Promise.all(
    upcomingEvents.map(async (event) => {
      const occurrences = await event.getOccurrences();
      const images = await event.getImages();
      return {
        title: event.title,
        summary: event.summary,
        description: event.description,
        location: event.location,
        occurrences: occurrences.map((occurrence) => ({
          start: occurrence.date,
          end: occurrence.endDate,
        })),
        images: images.map((image) => ({
          url: image.url ?? null,
          alt: image.alt ?? null,
          mimeType: image.mimeType,
          thumbHash: image.thumbHash?.toString("base64") ?? null,
          width: image.width,
          height: image.height,
          imageData: image.imageData?.toString("base64") ?? null,
        })),
      };
    })
  );

  ctx.body = eventsJson;
  ctx.type = "application/json";

  await next();
};
