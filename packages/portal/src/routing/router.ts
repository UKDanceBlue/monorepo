import { Router } from "@tanstack/react-router";

import { eventsRoute, homeRoute } from "./baseRoutes";
import { rootRoute } from "./rootRoute";

const routeTree = rootRoute.addChildren([homeRoute, eventsRoute]);

export const router = new Router({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
