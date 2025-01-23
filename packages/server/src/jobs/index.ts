import { Service } from "@freshgum/typedi";

import { logger } from "#logging/standardLogging.js";

import { FetchPushReceiptsJob } from "./fetchPushReceipts.js";
import { GarbageCollectLoginFlowSessionsJob } from "./garbageCollectLogins.js";
import { GetBBNEventsJob } from "./getBBNEvents.js";
import { HousekeepingJob } from "./housekeeping.js";
import { NotificationScheduler } from "./NotificationScheduler.js";
import { SyncDbFundsJob, SyncDbFundsPastJob } from "./syncDbFunds.js";

logger.info("Jobs started");

@Service([
  FetchPushReceiptsJob,
  GarbageCollectLoginFlowSessionsJob,
  GetBBNEventsJob,
  HousekeepingJob,
  NotificationScheduler,
  SyncDbFundsJob,
  SyncDbFundsPastJob,
])
export class JobScheduler {
  constructor(
    protected readonly fetchPushReceiptsJob: FetchPushReceiptsJob,
    protected readonly garbageCollectLoginFlowSessionsJob: GarbageCollectLoginFlowSessionsJob,
    protected readonly getBBNEventsJob: GetBBNEventsJob,
    protected readonly housekeepingJob: HousekeepingJob,
    protected readonly notificationScheduler: NotificationScheduler,
    protected readonly syncDbFundsJob: SyncDbFundsJob,
    protected readonly syncDbFundsPastJob: SyncDbFundsPastJob
  ) {}

  async start() {
    await this.fetchPushReceiptsJob.start();
    await this.garbageCollectLoginFlowSessionsJob.start();
    await this.getBBNEventsJob.start();
    await this.housekeepingJob.start();
    await this.notificationScheduler.start();
    await this.syncDbFundsJob.start();
    await this.syncDbFundsPastJob.start();
  }
}
