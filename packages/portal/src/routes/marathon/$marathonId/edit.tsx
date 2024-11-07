import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";

import { EditMarathonForm } from "#elements/forms/marathon/EditMarathonForm.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

function EditMarathonPage() {
  return (
    <div>
      <EditMarathonForm marathonId={Route.useParams().marathonId} />
    </div>
  );
}

export const Route = createFileRoute("/marathon/$marathonId/edit")({
  component: EditMarathonPage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.SuperAdmin,
      },
    ],
  },
});
