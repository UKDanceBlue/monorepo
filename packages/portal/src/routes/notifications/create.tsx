import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";

import { CreateNotificationForm } from "#elements/forms/notification/create/CreateNotificationForm.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

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
