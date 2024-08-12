import { imagesRoute } from "./baseRoutes";

import { ListImagesPage } from "@pages/images/list/ListImagesPage";
import { Route } from "@tanstack/react-router";


export const imagesTableRoute = new Route({
  path: "/",
  getParentRoute: () => imagesRoute,
  component: ListImagesPage,
});
