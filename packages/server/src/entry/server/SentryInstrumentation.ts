// This file is first imported by index.ts

import { Service } from "@freshgum/typedi";
import { type NodeClient } from "@sentry/node";

// import { logger } from "#logging/standardLogging.js";

@Service([])
export class SentryInstrumentation {
  #sentry?: NodeClient;

  public async init() {
    const { default: sentry } = await import("./initSentry.js");
    this.#sentry = sentry;

    // logger.info("Sentry loaded");
  }

  public get sentry(): NodeClient {
    if (!this.#sentry) {
      throw new Error("Sentry not initialized");
    }
    return this.#sentry;
  }
}
