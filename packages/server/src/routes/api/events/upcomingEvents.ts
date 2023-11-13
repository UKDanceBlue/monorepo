import { Op } from "@sequelize/core";
import type { EventOccurrenceResource } from "@ukdanceblue/common";
import type { Context } from "koa";
import type { NextFn } from "type-graphql";

import { EventModel } from "../../../models/Event.js";
import { EventOccurrenceModel } from "../../../models/EventOccurrence.js";

const eventToHtml = (eventModel: EventModel) => {
  const occurrences: EventOccurrenceResource[] =
    eventModel.occurrences?.map((occurrence) => occurrence.toResource()) ?? [];

  const occurrenceStrings = occurrences.map((occurrence) => {
    if (occurrence.fullDay) {
      return occurrence.interval.hasSame("day")
        ? `<li>${
            occurrence.interval.start?.toFormat("EEEE, LLLL d") ?? ""
          }</li>`
        : `<li>${occurrence.interval.toFormat("EEEE, LLLL d")}</li>`;
    } else {
      return `<li>${occurrence.interval.toFormat("EEEE, LLLL d, h:mm a")}</li>`;
    }
  });

  return `<div>
    <p>${eventModel.title}</p>
    <p>${eventModel.summary}</p>
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

  const upcomingEvents = await EventModel.withoutScope().findAll({
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
      },
    ],
  });

  const eventsHtml = await Promise.all(upcomingEvents.map(eventToHtml));

  ctx.body = `<div>${eventsHtml.join("\n")}</div>`;
  ctx.type = "text/html";

  await next();
};
