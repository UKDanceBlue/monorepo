import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";

import { PersonCreator } from "@/elements/forms/person/create/PersonCreator.js";
import { routerAuthCheck } from "@/tools/routerAuthCheck.js";

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
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Admin,
      },
    ],
  },
});
