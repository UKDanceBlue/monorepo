import { ListImagesPage } from "@pages/images/list/ListImagesPage";
import { Route } from "@tanstack/react-router";

import { imagesRoute } from "./baseRoutes";

export const imagesTableRoute = new Route({
  path: "/",
  getParentRoute: () => imagesRoute,
  component: ListImagesPage,
});
