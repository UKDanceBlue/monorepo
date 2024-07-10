import Cron from "croner";
import { Container } from "typedi";

import { logger } from "#logging/standardLogging.js";
import { ExpoPushReceiptHandler } from "#notification/ExpoPushReceiptHandler.js";
import { JobStateRepository } from "#repositories/JobState.js";
const jobStateRepository = Container.get(JobStateRepository);

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
