// This file is first imported by index.ts

import {
  type Environment,
  getEnvironment,
  setEnvironment,
} from "#lib/typediTokens.js";

export abstract class EnvironmentService {
  protected abstract getEnvObject(): Promise<
    Environment & {
      NODE_ENV: string;
    }
  >;

  async populate(): Promise<void> {
    let env;
    try {
      env = await this.getEnvObject();
    } catch (error) {
      console.error("Error loading environment variables", error);
      process.exit(1);
    }

    setEnvironment(env);
    try {
      getEnvironment();
    } catch (error) {
      throw new Error("Error loading environment variables", { cause: error });
    }

    // For third party libraries that rely on NODE_ENV
    process.env.NODE_ENV = env.NODE_ENV;
  }
}
