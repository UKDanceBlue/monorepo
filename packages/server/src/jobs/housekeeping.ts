/* eslint-disable no-await-in-loop */
import { Container } from "@freshgum/typedi";
import type { PrismaClient } from "@prisma/client";
import { Cron } from "croner";

import { prismaToken } from "#lib/typediTokens.js";
import { logger } from "#logging/standardLogging.js";
import { JobStateRepository } from "#repositories/JobState.js";

const jobStateRepository = Container.get(JobStateRepository);

export const housekeeping = new Cron(
  "1 0 * * * *",
  {
    name: "housekeeping",
    paused: true,
    catch: (error) => {
      logger.error("Failed to fixup user data", { error });
    },
  },
  async () => {
    const prisma = Container.get(prismaToken);
    await userHousekeeping(prisma);
    await fundraisingHousekeeping(prisma);
  }
);

housekeeping.options.startAt =
  await jobStateRepository.getNextJobDate(housekeeping);
housekeeping.resume();

async function userHousekeeping(prisma: PrismaClient) {
  try {
    logger.info("Cleaning up user data");
    const badLinkblues = await prisma.person.findMany({
      where: {
        linkblue: {
          endsWith: "@uky.edu",
        },
      },
    });

    // Remove any from the list where the corrected version already exists
    const limitedBadLinkblues = [];
    for (const badLinkblue of badLinkblues) {
      const existingPerson = await prisma.person.findFirst({
        where: {
          linkblue: badLinkblue.linkblue?.replace("@uky.edu", ""),
        },
      });
      if (!existingPerson) {
        limitedBadLinkblues.push(badLinkblue);
      }
    }

    for (const badLinkblue of limitedBadLinkblues) {
      await prisma.person.update({
        where: {
          id: badLinkblue.id,
        },
        data: {
          linkblue: badLinkblue.linkblue?.replace("@uky.edu", ""),
        },
      });
    }

    const badEmails = await prisma.person.findMany({
      where: {
        email: {
          endsWith: "@uky.edu@uky.edu",
        },
      },
    });

    const limitedBadEmails = [];
    for (const badEmail of badEmails) {
      const existingPerson = await prisma.person.findFirst({
        where: {
          email: badEmail.linkblue?.replace("@uky.edu@uky.edu", "@uky.edu"),
        },
      });
      if (!existingPerson) {
        limitedBadEmails.push(badEmail);
      }
    }

    for (const badEmail of limitedBadEmails) {
      await prisma.person.update({
        where: {
          id: badEmail.id,
        },
        data: {
          email: badEmail.linkblue?.replace("@uky.edu@uky.edu", "@uky.edu"),
        },
      });
    }

    await jobStateRepository.logCompletedJob(housekeeping);
  } catch (error) {
    logger.error("Failed to clean up user data", { error });
  }
}

async function fundraisingHousekeeping(prisma: PrismaClient) {
  const orphanEntries = await prisma.fundraisingEntry.deleteMany({
    where: {
      AND: [
        {
          dbFundsEntry: {
            is: null,
          },
        },
        {
          ddn: {
            is: null,
          },
        },
      ],
    },
  });
  if (orphanEntries.count > 0)
    logger.info("Deleted sourceless entries", {
      count: orphanEntries.count,
    });
}
