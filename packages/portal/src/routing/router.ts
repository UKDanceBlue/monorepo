import { Router } from "@tanstack/react-router";

import { eventsRoute, homeRoute, teamsRoute } from "./baseRoutes";
import {
  createEventRoute,
  editEventRoute,
  eventsTableRoute,
  singleEventRoute,
  viewEventRoute,
} from "./eventRoutes";
import { rootRoute } from "./rootRoute";
import {
  createTeamRoute,
  editTeamRoute,
  singleTeamRoute,
  teamsTableRoute,
  viewTeamRoute,
} from "./teamRoutes";

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventsRoute.addChildren([
    eventsTableRoute,
    createEventRoute,
    singleEventRoute.addChildren([editEventRoute, viewEventRoute]),
  ]),
  teamsRoute.addChildren([
    teamsTableRoute,
    createTeamRoute,
    singleTeamRoute.addChildren([editTeamRoute, viewTeamRoute]),
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
