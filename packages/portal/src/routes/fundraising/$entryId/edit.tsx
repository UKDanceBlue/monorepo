import { createFileRoute, useParams } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";

import { FundraisingEntryEditor } from "#elements/forms/fundraising-entry/edit/FundraisingEntryEditor.tsx";

export const Route = createFileRoute("/fundraising/$entryId/edit")({
  component: RouteComponent,

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
