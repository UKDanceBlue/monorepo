console.log(
  "This page allows you to create a notification. The outline of the notification will be presented at the top of the page and who it will go to. You can send this to a specific person or group of people or everyone. After clicking create you will go to the “notification overview” page. On this page you will then click manage delivery. This is where you will schedule the notification or just send the notification. "
);
import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";

import { CreateNotificationForm } from "@/elements/forms/notification/create/CreateNotificationForm";
import { routerAuthCheck } from "@/tools/routerAuthCheck.js";

function CreateNotificationPage() {
  return (
    <div>
      <h1>Create Notification</h1>
      <CreateNotificationForm />
    </div>
  );
}

export const Route = createFileRoute("/notifications/create")({
  component: CreateNotificationPage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      },
    ],
  },
});
