import { Service } from "@freshgum/typedi";

import { logger } from "#logging/standardLogging.js";
import { JobStateRepository } from "#repositories/JobState.js";
import { LoginFlowRepository } from "#repositories/LoginFlowSession.js";
import { SessionRepository } from "#repositories/Session.js";

import { Job } from "./Job.js";

/**
 * This job simply deletes old login flow sessions that were not automatically deleted
 * as part of the login process.
 */
@Service([JobStateRepository, LoginFlowRepository, SessionRepository])
export class GarbageCollectLoginFlowSessionsJob extends Job {
  constructor(
    protected readonly jobStateRepository: JobStateRepository,
    protected readonly loginFlowRepository: LoginFlowRepository,
    protected readonly sessionRepository: SessionRepository
  ) {
    super("0 0 */6 * * *", "garbage-collect-login-flow-sessions");
  }

  protected async run(): Promise<void> {
    logger.info("Garbage collecting old login flows");
    await this.loginFlowRepository.gcOldLoginFlows();
    await this.sessionRepository
      .gcOldSessions()
      .promise.then((res) => res.unwrap());
  }
}
