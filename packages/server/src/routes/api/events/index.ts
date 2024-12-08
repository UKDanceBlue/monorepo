import { Service } from "@freshgum/typedi";
import cors from "cors";
import { DateTime } from "luxon";

import { FileManager } from "#files/FileManager.js";
import { combineMimePartsToString } from "#files/mime.js";
import { getHostUrl } from "#lib/host.js";
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
  constructor(
    private eventRepository: EventRepository,
    private fileManager: FileManager
  ) {
    super("/events");

    this.addGetRoute("/upcoming", cors(), async (req, res, next) => {
      try {
        let eventsToSend = 10;
        if (req.query.count) {
          const parsedCountParam =
            typeof req.query.count === "string"
              ? Number.parseInt(req.query.count, 10)
              : Number.parseInt(String((req.query.count as string[])[0]), 10);
          if (!Number.isNaN(parsedCountParam)) {
            eventsToSend = parsedCountParam;
          }
        }
        let until = DateTime.now().plus({ years: 1 }).toJSDate();
        if (req.query.until) {
          const parsedUntilParam =
            typeof req.query.until === "string"
              ? DateTime.fromISO(req.query.until)
              : DateTime.fromISO(String((req.query.until as string[])[0]));
          if (parsedUntilParam.isValid) {
            until = parsedUntilParam.toJSDate();
          }
        }

        const upcomingEvents = await this.eventRepository.getUpcomingEvents({
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
                  const externalUrl = await this.fileManager.getExternalUrl(
                    image.file,
                    getHostUrl(req)
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

        res.json(eventsJson);
      } catch (error) {
        next(error);
      }
    });
  }
}
