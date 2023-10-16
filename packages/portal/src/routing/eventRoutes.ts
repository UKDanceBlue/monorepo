import { CreateEventPage } from "@pages/events/create-event/CreateEventPage";
import { ListEvensPage } from "@pages/events/list-events/ListEventsPage";
import { SingleEventPage } from "@pages/events/single-event/SingleEventPage";
import { EditEventPage } from "@pages/events/single-event/edit-event/EditEventPage";
import { ViewEventPage } from "@pages/events/single-event/view-event/ViewEventPage";
import { Route } from "@tanstack/react-router";

import { eventsRoute } from "./baseRoutes";

export const eventsTableRoute = new Route({
  path: "/",
  getParentRoute: () => eventsRoute,
  component: ListEvensPage,
});

export const createEventRoute = new Route({
  path: "create",
  getParentRoute: () => eventsRoute,
  component: CreateEventPage,
});

export const singleEventRoute = new Route({
  path: "$eventId",
  getParentRoute: () => eventsRoute,
  component: SingleEventPage,
});

export const viewEventRoute = new Route({
  path: "/",
  getParentRoute: () => singleEventRoute,
  component: ViewEventPage,
});

export const editEventRoute = new Route({
  path: "edit",
  getParentRoute: () => singleEventRoute,
  component: EditEventPage,
});
