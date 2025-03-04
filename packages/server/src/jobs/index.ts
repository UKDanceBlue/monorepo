import { Service } from "@freshgum/typedi";

import { logger } from "#logging/standardLogging.js";

import { FetchPushReceiptsJob } from "./fetchPushReceipts.js";
import { GarbageCollectLoginFlowSessionsJob } from "./garbageCollectLogins.js";
import { GetBBNEventsJob } from "./getBBNEvents.js";
import { HousekeepingJob } from "./housekeeping.js";
import { NotificationScheduler } from "./NotificationScheduler.js";
import { RefreshInstagreamTokenJob } from "./refreshInstagramAccess.js";

logger.info("Jobs started");

@Service([
  FetchPushReceiptsJob,
  GarbageCollectLoginFlowSessionsJob,
  GetBBNEventsJob,
  HousekeepingJob,
  NotificationScheduler,
  RefreshInstagreamTokenJob,
])
export class JobScheduler {
  constructor(
    protected readonly fetchPushReceiptsJob: FetchPushReceiptsJob,
    protected readonly garbageCollectLoginFlowSessionsJob: GarbageCollectLoginFlowSessionsJob,
    protected readonly getBBNEventsJob: GetBBNEventsJob,
    protected readonly housekeepingJob: HousekeepingJob,
    protected readonly notificationScheduler: NotificationScheduler,
    protected readonly refreshInstagreamTokenJob: RefreshInstagreamTokenJob
  ) {}

  async start() {
    await this.fetchPushReceiptsJob.start();
    await this.garbageCollectLoginFlowSessionsJob.start();
    await this.getBBNEventsJob.start();
    await this.housekeepingJob.start();
    await this.notificationScheduler.start();
    await this.refreshInstagreamTokenJob.start();
  }
}
