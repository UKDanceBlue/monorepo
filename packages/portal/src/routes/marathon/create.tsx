import { createFileRoute } from "@tanstack/react-router";

import { CreateMarathonForm } from "#elements/forms/marathon/CreateMarathonForm.js";

export function CreateMarathonPage() {
  return (
    <div>
      <CreateMarathonForm />
    </div>
  );
}

export const Route = createFileRoute("/marathon/create")({
  component: CreateMarathonPage,
});
