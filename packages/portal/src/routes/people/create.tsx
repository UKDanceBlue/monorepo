import { PersonCreator } from "@elements/forms/person/create/PersonCreator";
import { createFileRoute } from "@tanstack/react-router";

function CreatePersonPage() {
  return (
    <div>
      <h1>Create Person</h1>
      <PersonCreator />
    </div>
  );
}

export const Route = createFileRoute("/people/create")({
  component: CreatePersonPage,
});
