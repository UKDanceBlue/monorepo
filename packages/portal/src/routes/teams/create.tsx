import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";

import { useMarathon } from "#config/marathonContext.js";
import { TeamCreator } from "#elements/forms/team/create/TeamCreator.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

function CreateTeamPage() {
  const selectedMarathon = useMarathon();
  return (
    <div>
      <h1>Create Team</h1>
      <TeamCreator selectedMarathon={selectedMarathon} />
    </div>
  );
}

export const Route = createFileRoute("/teams/create")({
  component: CreateTeamPage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
        committeeIdentifier: CommitteeIdentifier.viceCommittee,
      },
      {
        accessLevel: AccessLevel.Admin,
      },
    ],
  },
});
