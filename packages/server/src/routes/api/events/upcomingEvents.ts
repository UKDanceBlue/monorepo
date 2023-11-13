import { Op } from "@sequelize/core";
import type { Context } from "koa";
import { DateTime } from "luxon";
import type { NextFn } from "type-graphql";

import { EventModel } from "../../../models/Event.js";
import { EventOccurrenceModel } from "../../../models/EventOccurrence.js";

const eventToHtml = async (eventModel: EventModel) => {
  const event = await eventModel.toResource();

  const occurrenceStrings = event.occurrences.map((occurrence) => {
    return `<li>${occurrence.interval.start?.toLocaleString(
      DateTime.DATE_FULL
    )}</li>`;
  });

  return `<div>
    <p>${event.title}</p>
    <p>${event.summary}</p>
    <ul>${occurrenceStrings.join("\n")}</ul>
  </div>`;
};

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

  const upcomingEvents = await EventModel.findAll({
    // where: { "$occurrences.date$": { [Op.gte]: new Date() } },
    order: [[EventOccurrenceModel, "date", "ASC"]],
    limit: eventsToSend,
    include: [
      {
        model: EventOccurrenceModel,
        where: {
          [Op.or]: [
            { date: { [Op.gte]: new Date() } },
            {
              [Op.and]: [
                { date: { [Op.lte]: new Date() } },
                { endDate: { [Op.gte]: new Date() } },
              ],
            },
          ],
        },
        required: true,
      },
    ],
  });

  const eventsHtml = await Promise.all(upcomingEvents.map(eventToHtml));

  ctx.body = `<div>${eventsHtml.join("\n")}</div>`;
  ctx.type = "text/html";

  await next();
};
