import Router from "@koa/router";

import { upcomingEventsHandler } from "./upcomingEvents.js";

const eventsApiRouter = new Router({ prefix: "/events" });

eventsApiRouter.get("/upcoming", upcomingEventsHandler);

export default eventsApiRouter;
