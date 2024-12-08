import { createFileRoute } from "@tanstack/react-router";

import { PersonCreator } from "#elements/forms/person/create/PersonCreator.js";

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
