import { CreateMarathonForm } from "@elements/forms/marathon/CreateMarathonForm";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";

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
