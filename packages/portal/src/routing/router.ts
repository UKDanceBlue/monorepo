import { Router } from "@tanstack/react-router";

import { eventsRoute, homeRoute, peopleRoute, teamsRoute } from "./baseRoutes";
import {
  createEventRoute,
  editEventRoute,
  eventsTableRoute,
  singleEventRoute,
  viewEventRoute,
} from "./eventRoutes";
import {
  editPersonRoute,
  peopleTableRoute,
  singlePersonRoute,
  viewPersonRoute,
} from "./personRouter";
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
  peopleRoute.addChildren([
    peopleTableRoute,
    singlePersonRoute.addChildren([editPersonRoute, viewPersonRoute]),
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
