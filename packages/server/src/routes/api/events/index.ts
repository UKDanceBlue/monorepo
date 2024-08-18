import { upcomingEventsHandler } from "./upcomingEvents.js";

import Router from "@koa/router";


const eventsApiRouter = new Router({ prefix: "/events" });

eventsApiRouter.get("/upcoming", upcomingEventsHandler);

export default eventsApiRouter;
