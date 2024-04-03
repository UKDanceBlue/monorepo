import { Route } from "@tanstack/react-router";

import { imagesRoute } from "./baseRoutes";

export const imagesOverviewRoute = new Route({
  path: "/",
  getParentRoute: () => imagesRoute,
  component: undefined,
});
