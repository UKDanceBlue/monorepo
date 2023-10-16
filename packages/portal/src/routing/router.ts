import { Router } from "@tanstack/react-router";

import { eventsRoute, homeRoute } from "./baseRoutes";
import {
  createEventRoute,
  editEventRoute,
  eventsTableRoute,
  singleEventRoute,
  viewEventRoute,
} from "./eventRoutes";
import { rootRoute } from "./rootRoute";

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventsRoute.addChildren([
    eventsTableRoute,
    createEventRoute,
    singleEventRoute.addChildren([editEventRoute, viewEventRoute]),
  ]),
]);

export const router = new Router({
  routeTree,
});

console.log(router.flatRoutes);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
