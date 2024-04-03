import { ConfigPage } from "@pages/config/ConfigPage";
import { EventsPage } from "@pages/events/EventsPage";
import { HomePage } from "@pages/home/HomePage";
import { MarathonsPage } from "@pages/marathon/MarathonsPage";
import { NotificationsPage } from "@pages/notifications/NotificationsPage";
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

export const configRoute = new Route({
  path: "config",
  getParentRoute: () => rootRoute,
  component: ConfigPage,
});

export const notificationsRoute = new Route({
  path: "notifications",
  getParentRoute: () => rootRoute,
  component: NotificationsPage,
});

export const marathonsRoute = new Route({
  path: "marathon",
  getParentRoute: () => rootRoute,
  component: MarathonsPage,
});

export const feedRoutes = new Route({
  path: "feed",
  getParentRoute: () => rootRoute,
  component: undefined,
});

export const imagesRoutes = new Route({
  path: "images",
  getParentRoute: () => rootRoute,
  component: undefined,
});
