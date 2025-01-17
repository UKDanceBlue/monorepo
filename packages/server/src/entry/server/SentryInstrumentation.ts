// This file is first imported by index.ts

import { Service } from "@freshgum/typedi";
import {
  anrIntegration,
  expressIntegration,
  init,
  type NodeClient,
  prismaIntegration,
} from "@sentry/node";

import { isDevelopmentToken } from "#lib/typediTokens.js";
// import { logger } from "#logging/standardLogging.js";

@Service([isDevelopmentToken])
export class SentryInstrumentation {
  #sentry?: NodeClient;
  constructor(private readonly isDevelopment: boolean) {}

  public init() {
    this.#sentry = init({
      dsn: "https://abd4a421b3c1748b991799a7b236f240@o4507762130681856.ingest.us.sentry.io/4508071851786240",
      integrations: [
        expressIntegration(),
        prismaIntegration(),
        anrIntegration({ captureStackTrace: true }),
      ],
      // Tracing
      tracesSampleRate: 1, //  Capture 100% of the transactions

      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 0.05,

      enabled: !this.isDevelopment,
    });

    // logger.info("Sentry loaded");
  }

  public get sentry(): NodeClient {
    if (!this.#sentry) {
      throw new Error("Sentry not initialized");
    }
    return this.#sentry;
  }
}
