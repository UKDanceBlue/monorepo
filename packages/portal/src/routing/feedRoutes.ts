import { Route } from "@tanstack/react-router";

import { feedRoutes } from "./baseRoutes";

export const feedOverviewRoute = new Route({
  path: "/",
  getParentRoute: () => feedRoutes,
  component: undefined,
});
