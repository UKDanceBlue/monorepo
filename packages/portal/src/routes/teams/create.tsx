import { TeamCreator } from "@elements/forms/team/create/TeamCreator";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";

function CreateTeamPage() {
  const { selectedMarathon } = Route.useLoaderData();
  return (
    <div>
      <h1>Create Team</h1>
      <TeamCreator selectedMarathon={selectedMarathon} />
    </div>
  );
}

export const Route = createFileRoute("/teams/create")({
  component: CreateTeamPage,
  loader({ context: { selectedMarathon } }) {
    return { selectedMarathon };
  },
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
