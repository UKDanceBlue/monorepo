/* eslint-disable no-await-in-loop */
import { faker } from "@faker-js/faker";
import type { CreationAttributes } from "@sequelize/core";
import { DateTime } from "luxon";

import { sequelizeDb } from "../data-source.js";
import { EventModel } from "../models/Event.js";
import type { EventOccurrenceModel } from "../models/EventOccurrence.js";
import { ImageModel } from "../models/Image.js";

const capitalize = (s: string) => s && s[0]!.toUpperCase()! + s.slice(1)!;

/**
 *
 */
export default async function () {
  const events: CreationAttributes<EventModel>[] = [];
  const eventOccurrences: CreationAttributes<EventOccurrenceModel>[][] = [];
  for (let i = 0; i < 25; i++) {
    eventOccurrences[i] = [];
    for (let j = 0; j < faker.datatype.number({ min: 1, max: 3 }); j++) {
      eventOccurrences[i]!.push({
        date: DateTime.fromJSDate(faker.date.soon(1)).toJSDate(),
        eventId: undefined as unknown as number,
      });
    }
    const adjective = capitalize(faker.word.adjective());

    const aOrAn = ["A", "E", "I", "O", "U"].includes(adjective[0]!)
      ? "an"
      : "a";
    events.push({
      id: undefined,
      title: `${capitalize(
        faker.word.verb()
      )} ${aOrAn} ${adjective} ${capitalize(faker.word.noun())}`,
      duration: DateTime.fromJSDate(faker.date.soon(1)).diffNow(),
      description: faker.lorem.paragraph(),
      summary: faker.lorem.sentence(),
      location: faker.address.streetAddress(),
    });
  }
  await Promise.all(
    events.map(async (event, i) => {
      const mod = await EventModel.create(event);
      for (const occurrence of eventOccurrences[i]!) {
        await mod.createOccurrence(occurrence);
      }
      return mod.save();
    })
  );

  // Now add 25 random images to random events
  const fifteenImages = await ImageModel.findAll({
    limit: 25,
    order: sequelizeDb.random(),
  });

  for (const image of fifteenImages) {
    const event = await EventModel.findOne({ order: sequelizeDb.random() });
    if (event) {
      await event.addImage(image);
    }
  }
}
