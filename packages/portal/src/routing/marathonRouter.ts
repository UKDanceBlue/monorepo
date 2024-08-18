import { marathonsRoute } from "./baseRoutes";

import { CreateMarathonPage } from "@pages/marathon/create/CreateMarathonPage";
import { MarathonOverviewPage } from "@pages/marathon/overview/MarathonOverviewPage";
import { SingleMarathonPage } from "@pages/marathon/single/SingleMarathonPage";
import { EditMarathonPage } from "@pages/marathon/single/edit/EditMarathonPage";
import { ViewMarathonPage } from "@pages/marathon/single/view/ViewMarathonPage";
import { MarathonHoursPage } from "@pages/marathon/single/view/hour/MarathonHoursPage";
import { AddMarathonHourPage } from "@pages/marathon/single/view/hour/add/AddMarathonHourPage";
import { EditMarathonHourPage } from "@pages/marathon/single/view/hour/edit/EditMarathonHourPage";
import { Route } from "@tanstack/react-router";


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
  path: "hours",
  getParentRoute: () => singleMarathonRoute,
  component: MarathonHoursPage,
});

export const addMarathonHourRoute = new Route({
  path: "add",
  getParentRoute: () => marathonHoursRoute,
  component: AddMarathonHourPage,
});

export const editMarathonHourRoute = new Route({
  path: "$hourId",
  getParentRoute: () => marathonHoursRoute,
  component: EditMarathonHourPage,
});
