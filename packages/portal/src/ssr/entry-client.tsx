import { init, tanstackRouterBrowserTracingIntegration } from "@sentry/react";
import { StartClient } from "@tanstack/react-start";
import { hydrateRoot } from "react-dom/client";

import { createRouter } from "../router.js";

const router = createRouter();

init({
  dsn: "https://f149f5546299b507f5e7b9b4aeafc2f4@o4507762130681856.ingest.us.sentry.io/4508071881932800",
  integrations: [tanstackRouterBrowserTracingIntegration(router)],
  tracesSampleRate: 0.1,
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/(app|dev)\.danceblue\.org\/(api|graphql)/,
  ],
  enabled: ["https://app.danceblue.org", "https://dev.danceblue.org"].includes(
    window.location.origin
  ),
});

hydrateRoot(document, <StartClient router={router} />);
