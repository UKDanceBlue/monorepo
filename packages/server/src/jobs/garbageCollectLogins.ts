import { logger } from "#logging/standardLogging.js";
import { LoginFlowSessionRepository } from "#repositories/LoginFlowSession.js";

import Cron from "croner";
import { Container } from "typedi";

import { JobStateRepository } from "#repositories/JobState.js";

const jobStateRepository = Container.get(JobStateRepository);

export const garbageCollectLoginFlowSessions = new Cron(
  "0 0 */6 * * *",
  {
    name: "garbage-collect-login-flow-sessions",
    paused: true,
    catch: (error) => {
      console.error("Failed to fetch push receipts", error);
    },
  },
  async () => {
    try {
      logger.info("Garbage collecting old login flows");
      const loginFlowSessionRepository = Container.get(
        LoginFlowSessionRepository
      );
      await loginFlowSessionRepository.gcOldLoginFlows();

      await jobStateRepository.logCompletedJob(garbageCollectLoginFlowSessions);
    } catch (error) {
      console.error("Failed to garbage collect old login flows", { error });
    }
  }
);

garbageCollectLoginFlowSessions.options.startAt =
  await jobStateRepository.getNextJobDate(garbageCollectLoginFlowSessions);
garbageCollectLoginFlowSessions.resume();
