import { CreateTeamPage } from "@pages/teams/spirit/create-team/CreateTeamPage";
import { ListTeamsPage } from "@pages/teams/spirit/list-teams/ListTeamsPage";
import { SingleTeamPage } from "@pages/teams/spirit/single-team/SingleTeamPage";
import { EditTeamPage } from "@pages/teams/spirit/single-team/edit-team/EditTeamPage";
import { ViewTeamPage } from "@pages/teams/spirit/single-team/view-team/ViewTeamPage";
import { ViewTeamFundraising } from "@pages/teams/spirit/single-team/view-team/fundraising/ViewTeamFundraising";
import { ViewTeamPoints } from "@pages/teams/spirit/single-team/view-team/points/ViewTeamPoints";
import { Route } from "@tanstack/react-router";

import { teamsRoute } from "./baseRoutes";

export const teamsTableRoute = new Route({
  path: "/",
  getParentRoute: () => teamsRoute,
  component: ListTeamsPage,
});

export const createTeamRoute = new Route({
  path: "create",
  getParentRoute: () => teamsRoute,
  component: CreateTeamPage,
});

export const singleTeamRoute = new Route({
  path: "$teamId",
  getParentRoute: () => teamsRoute,
  component: SingleTeamPage,
});

export const editTeamRoute = new Route({
  path: "edit",
  getParentRoute: () => singleTeamRoute,
  component: EditTeamPage,
});

export const viewTeamRoute = new Route({
  path: "/",
  getParentRoute: () => singleTeamRoute,
  component: ViewTeamPage,
});

export const ViewTeamFundraisingRoute = new Route({
  path: "fundraising",
  getParentRoute: () => viewTeamRoute,
  component: ViewTeamFundraising,
});

export const ViewTeamPointsRoute = new Route({
  path: "points",
  getParentRoute: () => viewTeamRoute,
  component: ViewTeamPoints,
});
