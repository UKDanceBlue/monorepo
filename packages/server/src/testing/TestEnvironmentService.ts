import type { Environment } from "#lib/typediTokens.js";

import { EnvironmentService } from "../entry/environment/environment.js";

export class TestEnvironmentService extends EnvironmentService {
  protected getEnvObject(): Promise<
    Environment & { expoAccessToken: string; NODE_ENV: string }
  > {
    return Promise.resolve({
      logDir: "/tmp",
      loggingLevel: "crit",
      isDevelopmentToken: false,
      isRepl: false,
      superAdminLinkblues: ["superAdmin"],
    } as Environment & { expoAccessToken: string; NODE_ENV: string });
  }
}
