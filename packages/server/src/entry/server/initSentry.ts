import "@freshgum/typedi";

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import * as Sentry from "@sentry/node";

export default Sentry.init({
  dsn: "https://abd4a421b3c1748b991799a7b236f240@o4507762130681856.ingest.us.sentry.io/4508071851786240",
  integrations: [
    Sentry.expressIntegration(),
    Sentry.prismaIntegration(),
    Sentry.anrIntegration({ captureStackTrace: true }),
  ],
  // Tracing
  tracesSampleRate: 0.5,
  // profilesSampleRate: 0.1,
  release: await readFile(
    fileURLToPath(import.meta.resolve("#BUILD_COMMIT")),
    "utf8"
  ).catch(() => undefined),
  enabled: process.env.NODE_ENV === "production",
});
