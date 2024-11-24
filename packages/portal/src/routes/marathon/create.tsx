import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";

import { CreateMarathonForm } from "#elements/forms/marathon/CreateMarathonForm.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

export function CreateMarathonPage() {
  return (
    <div>
      <CreateMarathonForm />
    </div>
  );
}

export const Route = createFileRoute("/marathon/create")({
  component: CreateMarathonPage,
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
