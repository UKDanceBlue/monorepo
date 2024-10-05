// This file is first imported by index.ts

import { logger } from "#logging/standardLogging.js";
import { init } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

init({
  dsn: "https://abd4a421b3c1748b991799a7b236f240@o4507762130681856.ingest.us.sentry.io/4508071851786240",
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 0.1, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 0.1,
});

logger.info("Sentry loaded");
