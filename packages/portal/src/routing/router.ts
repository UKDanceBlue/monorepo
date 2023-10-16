import { Router } from "@tanstack/react-router";

import { eventsRoute, homeRoute } from "./baseRoutes";
import {
  createEventRoute,
  editEventRoute,
  singleEventRoute,
  viewEventRoute,
} from "./eventRoutes";
import { rootRoute } from "./rootRoute";

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventsRoute.addChildren([
    createEventRoute,
    singleEventRoute.addChildren([editEventRoute, viewEventRoute]),
  ]),
]);

export const router = new Router({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
