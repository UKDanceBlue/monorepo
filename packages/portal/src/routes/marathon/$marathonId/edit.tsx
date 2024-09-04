import { EditMarathonForm } from "@elements/forms/marathon/EditMarathonForm";
import { createFileRoute } from "@tanstack/react-router";

function EditMarathonPage() {
  return (
    <div>
      <EditMarathonForm />
    </div>
  );
}

export const Route = createFileRoute("/marathon/$marathonId/edit")({
  component: EditMarathonPage,
});
