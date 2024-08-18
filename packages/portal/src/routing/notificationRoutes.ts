import { notificationsRoute } from "./baseRoutes";

import { CreateNotificationPage } from "@pages/notifications/create/CreateNotificationPage";
import { ListNotificationsPage } from "@pages/notifications/list/ListNotificationsPage";
import { SingleNotificationPage } from "@pages/notifications/single/SingleNotificationPage";
import { ManageNotificationPage } from "@pages/notifications/single/manage/ManageNotificationPage";
import { ViewNotificationPage } from "@pages/notifications/single/view/ViewNotificationPage";
import { Route } from "@tanstack/react-router";


export const notificationsTableRoute = new Route({
  path: "/",
  getParentRoute: () => notificationsRoute,
  component: ListNotificationsPage,
});

export const createNotificationRoute = new Route({
  path: "create",
  getParentRoute: () => notificationsRoute,
  component: CreateNotificationPage,
});

export const singleNotificationRoute = new Route({
  path: "$notificationId",
  getParentRoute: () => notificationsRoute,
  component: SingleNotificationPage,
});

export const viewNotificationRoute = new Route({
  path: "/",
  getParentRoute: () => singleNotificationRoute,
  component: ViewNotificationPage,
});

export const manageNotificationRoute = new Route({
  path: "manage",
  getParentRoute: () => singleNotificationRoute,
  component: ManageNotificationPage,
});
