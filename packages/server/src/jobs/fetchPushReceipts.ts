import Cron from "croner";
import { Container } from "typedi";

import { logger } from "#logging/standardLogging.js";
import { ExpoPushReceiptHandler } from "#notification/ExpoPushReceiptHandler.js";

export const fetchPushReceipts = new Cron(
  "0 */8 * * * *",
  {
    name: "fetch-push-receipts",
    catch: (error) => {
      console.error("Failed to fetch push receipts", error);
    },
  },
  async () => {
    try {
      logger.info("Fetching push receipts");
      const expoPushReceiptHandler = Container.get(ExpoPushReceiptHandler);
      await expoPushReceiptHandler.handlePushReceipts();
    } catch (error) {
      console.error("Failed to fetch push receipts", { error });
    }
  }
);
