import { PersonCreator } from "@elements/forms/person/create/PersonCreator";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";

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
