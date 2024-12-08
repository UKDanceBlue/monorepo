import { Container } from "@freshgum/typedi";
import { Cron } from "croner";
import { AsyncResult } from "ts-results-es";
import TurndownService from "turndown";

import { getBbnvolvedEvents } from "#lib/external-apis/event/bbnvolvedApi.js";
import { logger } from "#logging/standardLogging.js";
import type { ForeignEvent } from "#repositories/event/EventRepository.js";
import { EventRepository } from "#repositories/event/EventRepository.js";
import { JobStateRepository } from "#repositories/JobState.js";

const jobStateRepository = Container.get(JobStateRepository);

/**
 * The purpose of this job is to periodically fetch push receipts from Expo which
 * are generated after a push notification is sent. This is necessary to determine
 * whether each notification was successfully delivered to the target device, if
 * an error occurred, or if the device needs to be unsubscribed.
 */
export const getBBNEvents = new Cron(
  "0 2 * * *",
  {
    name: "get-bbnvolved-events",
    paused: true,
    catch: (error) => {
      logger.error("Failed to get new bbnvolved events", error);
    },
  },
  async () => {
    try {
      const turndownService = new TurndownService();
      const eventRepository = Container.get(EventRepository);

      const createdEvents = await new AsyncResult(getBbnvolvedEvents(15))
        .map((events): ForeignEvent[] =>
          events.map((event) => ({
            id: event.id,
            title: event.name,
            description: turndownService.turndown(event.description),
            imageUrls: event.imagePath
              ? [
                  new URL(
                    `https://se-images.campuslabs.com/clink/images/${event.imagePath}?preset=large-w`
                  ),
                ]
              : [],
            location: event.location,
            url: new URL(`https://uky.campuslabs.com/engage/event/${event.id}`),
            endsOn: event.endsOn.isValid ? event.endsOn.toISO() : undefined,
            startsOn: event.startsOn.isValid
              ? event.startsOn.toISO()
              : undefined,
          }))
        )
        .andThen((events) => eventRepository.loadForeignEvents(events)).promise;

      if (createdEvents.isErr()) {
        logger.error("Failed to create new events", {
          error: createdEvents.error,
        });
        return;
      } else {
        logger.info(`Created ${createdEvents.value.length} new events`);
      }
    } catch (error) {
      logger.error("Failed to get new bbnvolved events", error);
    }
  }
);

getBBNEvents.options.startAt =
  await jobStateRepository.getNextJobDate(getBBNEvents);
getBBNEvents.resume();
