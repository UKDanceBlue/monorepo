import { EventsPage } from "@pages/events/EventsPage";
import { HomePage } from "@pages/home/HomePage";
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
