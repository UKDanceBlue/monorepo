import { Router } from "@tanstack/react-router";

import {
  configRoute,
  eventsRoute,
  homeRoute,
  notificationsRoute,
  peopleRoute,
  teamsRoute,
} from "./baseRoutes";
import {
  createEventRoute,
  editEventRoute,
  eventsTableRoute,
  singleEventRoute,
  viewEventRoute,
} from "./eventRoutes";
import {
  createNotificationRoute,
  manageNotificationRoute,
  notificationsTableRoute,
  singleNotificationRoute,
  viewNotificationRoute,
} from "./notificationRoutes";
import {
  createPersonRoute,
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
    createPersonRoute,
    singlePersonRoute.addChildren([editPersonRoute, viewPersonRoute]),
  ]),
  configRoute,
  notificationsRoute.addChildren([
    notificationsTableRoute,
    createNotificationRoute,
    singleNotificationRoute.addChildren([
      viewNotificationRoute,
      manageNotificationRoute,
    ]),
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
