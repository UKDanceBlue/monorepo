import { EventsPage } from "@pages/events/EventsPage";
import { HomePage } from "@pages/home/HomePage";
import { LogsPage } from "@pages/logging/LogsPage";
import { PeoplePage } from "@pages/people/PeoplePage";
import { TeamsPage } from "@pages/teams/TeamsPage";
import { rootRoute } from "@routing/rootRoute";
import { Route } from "@tanstack/react-router";

export const homeRoute = new Route({
  path: "/",
  getParentRoute: () => rootRoute,
  component: HomePage,
});

export const eventsRoute = new Route({
  path: "events",
  getParentRoute: () => rootRoute,
  component: EventsPage,
});

export const teamsRoute = new Route({
  path: "teams",
  getParentRoute: () => rootRoute,
  component: TeamsPage,
});

export const peopleRoute = new Route({
  path: "people",
  getParentRoute: () => rootRoute,
  component: PeoplePage,
});

export const logsRoute = new Route({
  path: "logs",
  getParentRoute: () => rootRoute,
  component: LogsPage,
});
