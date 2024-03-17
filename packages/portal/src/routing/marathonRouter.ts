import { CreateMarathonPage } from "@pages/marathon/create/CreateMarathonPage";
import { MarathonOverviewPage } from "@pages/marathon/overview/MarathonOverviewPage";
import { SingleMarathonPage } from "@pages/marathon/single/SingleMarathonPage";
import { EditMarathonPage } from "@pages/marathon/single/edit/EditMarathonPage";
import { ViewMarathonPage } from "@pages/marathon/single/view/ViewMarathonPage";
import { MarathonHoursPage } from "@pages/marathon/single/view/hour/MarathonHoursPage";
import { EditMarathonHourPage } from "@pages/marathon/single/view/hour/edit/EditMarathonHourPage";
import { ViewMarathonHourPage } from "@pages/marathon/single/view/hour/view/ViewMarathonHourPage";
import { Route } from "@tanstack/react-router";

import { marathonsRoute } from "./baseRoutes";

export const marathonOverviewRoute = new Route({
  path: "/",
  getParentRoute: () => marathonsRoute,
  component: MarathonOverviewPage,
});

export const singleMarathonRoute = new Route({
  path: "$marathonId",
  getParentRoute: () => marathonsRoute,
  component: SingleMarathonPage,
});

export const viewMarathonRoute = new Route({
  path: "/",
  getParentRoute: () => singleMarathonRoute,
  component: ViewMarathonPage,
});

export const editMarathonRoute = new Route({
  path: "edit",
  getParentRoute: () => singleMarathonRoute,
  component: EditMarathonPage,
});

export const createMarathonRoute = new Route({
  path: "create",
  getParentRoute: () => marathonsRoute,
  component: CreateMarathonPage,
});

export const marathonHoursRoute = new Route({
  path: "hours/$hourId",
  getParentRoute: () => singleMarathonRoute,
  component: MarathonHoursPage,
});

export const viewMarathonHourRoute = new Route({
  path: "/",
  getParentRoute: () => marathonHoursRoute,
  component: ViewMarathonHourPage,
});

export const editMarathonHourRoute = new Route({
  path: "edit",
  getParentRoute: () => marathonHoursRoute,
  component: EditMarathonHourPage,
});