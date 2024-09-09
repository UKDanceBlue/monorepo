import { BulkPersonCreator } from "@elements/forms/person/create/BulkPersonCreator";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";

function BulkCreatePersonPage() {
  return (
    <div>
      <h1>Upload Person CSV</h1>
      <BulkPersonCreator />
    </div>
  );
}

export const Route = createFileRoute("/people/bulk")({
  component: BulkCreatePersonPage,
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
