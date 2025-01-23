import { Service } from "@freshgum/typedi";

import { logger } from "#logging/standardLogging.js";
import { ExpoPushReceiptHandler } from "#notification/ExpoPushReceiptHandler.js";
import { JobStateRepository } from "#repositories/JobState.js";

import { Job } from "./Job.js";

/**
 * The purpose of this job is to periodically fetch push receipts from Expo which
 * are generated after a push notification is sent. This is necessary to determine
 * whether each notification was successfully delivered to the target device, if
 * an error occurred, or if the device needs to be unsubscribed.
 */
@Service([ExpoPushReceiptHandler, JobStateRepository])
export class FetchPushReceiptsJob extends Job {
  constructor(
    protected readonly expoPushReceiptHandler: ExpoPushReceiptHandler,
    protected readonly jobStateRepository: JobStateRepository
  ) {
    super("0 */8 * * * *", "fetch-push-receipts");
  }

  protected async run(): Promise<void> {
    logger.info("Fetching push receipts");
    await this.expoPushReceiptHandler.handlePushReceipts();
  }
}
