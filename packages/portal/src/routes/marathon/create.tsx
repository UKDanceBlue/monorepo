import { CreateMarathonForm } from "@elements/forms/marathon/CreateMarathonForm";
import { createFileRoute } from "@tanstack/react-router";

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
