import { Route } from "@tanstack/react-router";

import { feedRoute } from "./baseRoutes";

export const feedOverviewRoute = new Route({
  path: "/",
  getParentRoute: () => feedRoute,
  component: undefined,
});
