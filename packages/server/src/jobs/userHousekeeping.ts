import { logger } from "#logging/standardLogging.js";

import Cron from "croner";
import { Container } from "@freshgum/typedi";

import { JobStateRepository } from "#repositories/JobState.js";
import { prismaToken } from "#prisma";

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

      for (const badLinkblue of badLinkblues) {
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

      for (const badEmail of badEmails) {
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
