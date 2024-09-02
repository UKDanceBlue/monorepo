import { peopleRoute } from "./baseRoutes";

import { CreatePersonPage } from "@pages/people/create-person/CreatePersonPage";
import { ListPeoplePage } from "@pages/people/list-people/ListPeoplePage";
import { SinglePersonPage } from "@pages/people/single-person/SinglePersonPage";
import { EditPersonPage } from "@pages/people/single-person/edit-person/EditPersonPage";
import { ViewPersonPage } from "@pages/people/single-person/view-person/ViewPersonPage";
import { Route } from "@tanstack/react-router";

export const peopleTableRoute = new Route({
  path: "/",
  getParentRoute: () => peopleRoute,
  component: ListPeoplePage,
});

export const singlePersonRoute = new Route({
  path: "/$personId",
  getParentRoute: () => peopleRoute,
  component: SinglePersonPage,
});

export const createPersonRoute = new Route({
  path: "/create",
  getParentRoute: () => peopleRoute,
  component: CreatePersonPage,
});

export const viewPersonRoute = new Route({
  path: "/",
  getParentRoute: () => singlePersonRoute,
  component: ViewPersonPage,
});

export const editPersonRoute = new Route({
  path: "/edit",
  getParentRoute: () => singlePersonRoute,
  component: EditPersonPage,
});
