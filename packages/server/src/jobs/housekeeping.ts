/* eslint-disable no-await-in-loop */
import { Service } from "@freshgum/typedi";

import { PrismaService } from "#lib/prisma.js";
import { logger } from "#logging/standardLogging.js";
import { JobStateRepository } from "#repositories/JobState.js";

import { Job } from "./Job.js";

@Service([JobStateRepository, PrismaService])
export class HousekeepingJob extends Job {
  constructor(
    protected readonly jobStateRepository: JobStateRepository,
    protected readonly prisma: PrismaService
  ) {
    super("1 0 * * * *", "housekeeping");
  }

  protected async run(): Promise<void> {
    await this.userHousekeeping();
  }

  async userHousekeeping() {
    try {
      logger.info("Cleaning up user data");
      const badLinkblues = await this.prisma.person.findMany({
        where: {
          linkblue: {
            endsWith: "@uky.edu",
          },
        },
      });

      // Remove any from the list where the corrected version already exists
      const limitedBadLinkblues = [];
      for (const badLinkblue of badLinkblues) {
        const existingPerson = await this.prisma.person.findFirst({
          where: {
            linkblue: badLinkblue.linkblue?.replace("@uky.edu", ""),
          },
        });
        if (!existingPerson) {
          limitedBadLinkblues.push(badLinkblue);
        }
      }

      for (const badLinkblue of limitedBadLinkblues) {
        await this.prisma.person.update({
          where: {
            id: badLinkblue.id,
          },
          data: {
            linkblue: badLinkblue.linkblue?.replace("@uky.edu", ""),
          },
        });
      }

      const badEmails = await this.prisma.person.findMany({
        where: {
          email: {
            endsWith: "@uky.edu@uky.edu",
          },
        },
      });

      const limitedBadEmails = [];
      for (const badEmail of badEmails) {
        const existingPerson = await this.prisma.person.findFirst({
          where: {
            email: badEmail.linkblue?.replace("@uky.edu@uky.edu", "@uky.edu"),
          },
        });
        if (!existingPerson) {
          limitedBadEmails.push(badEmail);
        }
      }

      for (const badEmail of limitedBadEmails) {
        await this.prisma.person.update({
          where: {
            id: badEmail.id,
          },
          data: {
            email: badEmail.linkblue?.replace("@uky.edu@uky.edu", "@uky.edu"),
          },
        });
      }
    } catch (error) {
      logger.error("Failed to clean up user data", { error });
    }
  }
}
