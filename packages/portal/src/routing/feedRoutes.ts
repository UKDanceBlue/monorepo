import { feedRoute } from "./baseRoutes";

import { Route } from "@tanstack/react-router";


export const feedOverviewRoute = new Route({
  path: "/",
  getParentRoute: () => feedRoute,
  component: undefined,
});
