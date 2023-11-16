import { ListPeoplePage } from "@pages/people/list-people/ListPeoplePage";
import { Route } from "@tanstack/react-router";

import { peopleRoute } from "./baseRoutes";

export const peopleTableRoute = new Route({
  path: "/",
  getParentRoute: () => peopleRoute,
  component: ListPeoplePage,
});
