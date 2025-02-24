import { Service } from "@freshgum/typedi";

import type { InsagramApi } from "#lib/external-apis/feed/instagramfeed.js";
import { PrismaService } from "#lib/prisma.js";
import { logger } from "#logging/standardLogging.js";
import { JobStateRepository } from "#repositories/JobState.js";

import { Job } from "./Job.js";

@Service([JobStateRepository, PrismaService])
export class RefreshInstagreamTokenJob extends Job {
  constructor(
    protected readonly jobStateRepository: JobStateRepository,
    protected readonly instagramApi: InsagramApi
  ) {
    super("0 0 */2 * *", "refresh-instagram-token");
  }

  protected async run(): Promise<void> {
    const result = await this.instagramApi.renewToken().promise;
    if (result.isOk()) {
      logger.info("Instagram token refreshed");
    } else {
      throw result.error;
    }
  }
}
