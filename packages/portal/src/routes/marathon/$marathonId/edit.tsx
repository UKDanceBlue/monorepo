import { createFileRoute } from "@tanstack/react-router";

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
});
