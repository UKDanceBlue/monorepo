import { Service } from "@freshgum/typedi";
import { Cron } from "croner";

import type { Drizzle } from "#db";
import { drizzleToken } from "#lib/typediTokens.js";

@Service([drizzleToken])
export class JobStateRepository {
  constructor(protected readonly db: Drizzle) {}

  /**
   * Log a new completion of a given job
   */
  async logCompletedJob(job: Cron) {
    const jobName = job.name;
    const previousRun = job.currentRun();
    if (jobName && previousRun) {
      // await this.prisma.jobState.upsert({
      //   where: { jobName },
      //   update: { lastRun: previousRun },
      //   create: { jobName, lastRun: previousRun },
      // });
    }
  }

  /**
   * Get the next scheduled run date for a given job based on its last run date
   */
  async getNextJobDate(job: Cron) {
    const jobName = job.name;
    let baseDate = new Date();
    if (jobName) {
      // const jobState = await this.prisma.jobState.findUnique({
      //   where: { jobName },
      // });
      // if (jobState) {
      //   baseDate = jobState.lastRun;
      // }
    }
    return job.nextRun(baseDate) ?? undefined;
  }
}
