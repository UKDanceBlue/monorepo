import { PrismaClient } from "@prisma/client";
import Cron from "croner";
import { Service } from "typedi";

@Service()
export class JobStateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async logCompletedJob(job: Cron) {
    const jobName = job.name;
    const previousRun = job.currentRun();
    if (jobName && previousRun) {
      await this.prisma.jobState.upsert({
        where: { jobName },
        update: { lastRun: previousRun },
        create: { jobName, lastRun: previousRun },
      });
    }
  }

  async getNextJobDate(job: Cron) {
    const jobName = job.name;
    let baseDate = new Date();
    if (jobName) {
      const jobState = await this.prisma.jobState.findUnique({
        where: { jobName },
      });
      if (jobState) {
        baseDate = jobState.lastRun;
      }
    }
    return job.nextRun(baseDate) ?? undefined;
  }
}
