import { createFileRoute } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";

import { BulkTeamCreator } from "#elements/forms/team/create/BulkTeamCreator.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

function BulkCreateTeamPage() {
  return (
    <div>
      <h1>Upload Team CSV</h1>
      <BulkTeamCreator />
    </div>
  );
}

export const Route = createFileRoute("/teams/bulk")({
  component: BulkCreateTeamPage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.SuperAdmin,
      },
      {
        committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
        minCommitteeRole: CommitteeRole.Chair,
      },
    ],
  },
});
