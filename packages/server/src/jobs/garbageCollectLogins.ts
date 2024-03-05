import Cron from "croner";
import { Container } from "typedi";

import { LoginFlowSessionRepository } from "../resolvers/LoginFlowSession.js";

export const garbageCollectLoginFlowSessions = new Cron(
  "0 0 */6 * * *",
  {
    name: "garbage-collect-login-flow-sessions",
    catch: (error) => {
      console.error("Failed to fetch push receipts", error);
    },
  },
  async () => {
    const loginFlowSessionRepository = Container.get(
      LoginFlowSessionRepository
    );
    await loginFlowSessionRepository.gcOldLoginFlows();
  }
);
