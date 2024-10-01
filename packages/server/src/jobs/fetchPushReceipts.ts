import { logger } from "#logging/standardLogging.js";
import { ExpoPushReceiptHandler } from "#notification/ExpoPushReceiptHandler.js";

import Cron from "croner";
import { Container } from "@freshgum/typedi";

import { JobStateRepository } from "#repositories/JobState.js";
const jobStateRepository = Container.get(JobStateRepository);

/**
 * The purpose of this job is to periodically fetch push receipts from Expo which
 * are generated after a push notification is sent. This is necessary to determine
 * whether each notification was successfully delivered to the target device, if
 * an error occurred, or if the device needs to be unsubscribed.
 */
export const fetchPushReceipts = new Cron(
  "0 */8 * * * *",
  {
    name: "fetch-push-receipts",
    paused: true,
    catch: (error) => {
      console.error("Failed to fetch push receipts", error);
    },
  },
  async () => {
    try {
      logger.info("Fetching push receipts");
      const expoPushReceiptHandler = Container.get(ExpoPushReceiptHandler);
      await expoPushReceiptHandler.handlePushReceipts();

      await jobStateRepository.logCompletedJob(fetchPushReceipts);
    } catch (error) {
      console.error("Failed to fetch push receipts", { error });
    }
  }
);

fetchPushReceipts.options.startAt =
  await jobStateRepository.getNextJobDate(fetchPushReceipts);
fetchPushReceipts.resume();
