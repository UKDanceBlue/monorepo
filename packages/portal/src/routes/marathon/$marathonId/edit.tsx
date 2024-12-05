import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";

import { EditMarathonForm } from "#elements/forms/marathon/EditMarathonForm.js";

function EditMarathonPage() {
  return (
    <div>
      <EditMarathonForm marathonId={Route.useParams().marathonId} />
    </div>
  );
}

export const Route = createFileRoute("/marathon/$marathonId/edit")({
  component: EditMarathonPage,

  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.SuperAdmin,
      },
    ],
  },
});
