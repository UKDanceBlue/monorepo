import { createFileRoute, useParams } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";

import { FundraisingEntryEditor } from "#elements/forms/fundraising-entry/edit/FundraisingEntryEditor.tsx";
import { routerAuthCheck } from "#tools/routerAuthCheck.tsx";

export const Route = createFileRoute("/fundraising/$entryId/edit")({
  component: RouteComponent,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Admin,
      },
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
        committeeIdentifier: CommitteeIdentifier.fundraisingCommittee,
      },
    ],
  },
});

function RouteComponent() {
  const { entryId } = useParams({
    from: "/fundraising/$entryId/edit",
  });

  return <FundraisingEntryEditor id={entryId} />;
}
