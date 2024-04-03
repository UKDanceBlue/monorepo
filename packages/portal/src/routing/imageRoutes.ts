import { Route } from "@tanstack/react-router";

import { imagesRoutes } from "./baseRoutes";

export const imagesOverviewRoute = new Route({
  path: "/",
  getParentRoute: () => imagesRoutes,
  component: undefined,
});
