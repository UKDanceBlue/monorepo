import * as Sentry from "@sentry/node";
import { Cron } from "croner";

import { logger } from "#lib/logging/standardLogging.js";
import type { JobStateRepository } from "#repositories/JobState.js";

export abstract class Job {
  protected abstract run(): Promise<void>;
  protected abstract jobStateRepository: JobStateRepository;
  protected cron: Cron;

  constructor(
    protected readonly cronString: string,
    protected readonly name: string
  ) {
    this.cron = new Cron(
      cronString,
      {
        name,
        paused: true,
        catch: (error) => {
          logger.error(`Failed to run job ${name}`, { error });
        },
      },
      async () => {
        await Sentry.withMonitor(
          name,
          async () => {
            try {
              await this.run();
              await this.jobStateRepository.logCompletedJob(this.cron);
            } catch (error) {
              logger.error(`Failed to run job ${name}`, { error });
            }
          },
          {
            schedule: {
              type: "crontab",
              value: cronString,
            },
            checkinMargin: 2,
            failureIssueThreshold: 2,
          }
        );
      }
    );
  }

  async start() {
    const startAt = await this.jobStateRepository.getNextJobDate(this.cron);
    this.cron.options.startAt = startAt;
    this.cron.resume();
    logger.debug(`Job ${this.name} started`);
  }
}
