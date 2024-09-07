import { CreateNotificationForm } from "@elements/forms/notification/create/CreateNotificationForm";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";

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
