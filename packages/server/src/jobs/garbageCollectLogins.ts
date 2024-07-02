import Cron from "croner";
import { Container } from "typedi";

import { logger } from "#logging/standardLogging.js";
import { LoginFlowSessionRepository } from "#repositories/LoginFlowSession.js";

export const garbageCollectLoginFlowSessions = new Cron(
  "0 0 */6 * * *",
  {
    name: "garbage-collect-login-flow-sessions",
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
    } catch (error) {
      console.error("Failed to garbage collect old login flows", { error });
    }
  }
);
