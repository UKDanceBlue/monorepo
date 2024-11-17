import { Container } from "@freshgum/typedi";
import { Cron } from "croner";

import { logger } from "@/logging/standardLogging.js";
import { JobStateRepository } from "@/repositories/JobState.js";
import { LoginFlowSessionRepository } from "@/repositories/LoginFlowSession.js";

const jobStateRepository = Container.get(JobStateRepository);

/**
 * This job simply deletes old login flow sessions that were not automatically deleted
 * as part of the login process.
 */
export const garbageCollectLoginFlowSessions = new Cron(
  "0 0 */6 * * *",
  {
    name: "garbage-collect-login-flow-sessions",
    paused: true,
    catch: (error) => {
      console.error("Failed to garbage collect old login flows", error);
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
