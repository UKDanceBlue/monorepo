import { Container } from "@freshgum/typedi";
import { Cron } from "croner";

import { logger } from "#logging/standardLogging.js";
import { prismaToken } from "#prisma";
import { JobStateRepository } from "#repositories/JobState.js";

const jobStateRepository = Container.get(JobStateRepository);

export const garbageCollectLoginFlowSessions = new Cron(
  "0 * * * * *",
  {
    name: "user-housekeeping",
    paused: true,
    catch: (error) => {
      console.error("Failed to fixup user data", error);
    },
  },
  async () => {
    try {
      logger.info("Cleaning up user data");
      const prisma = Container.get(prismaToken);
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

      await jobStateRepository.logCompletedJob(garbageCollectLoginFlowSessions);
    } catch (error) {
      console.error("Failed to clean up user data", { error });
    }
  }
);

garbageCollectLoginFlowSessions.options.startAt =
  await jobStateRepository.getNextJobDate(garbageCollectLoginFlowSessions);
garbageCollectLoginFlowSessions.resume();
