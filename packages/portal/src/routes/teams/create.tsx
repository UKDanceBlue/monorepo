console.log(
  "It's easy… type the name of the team and put spirit. Choose if the team has been a team before or a new team and then save it. You can add members by typing their name in the add member box. At the bottom  of the page you will see the options for fundraising and spirit points. This is where you will give the points that they can see and $$$$. The fundraising amounts will be imported from DB funds… team captains will be able to delegate the money to the right person. "
);
import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";

import { useMarathon } from "@/config/marathonContext.js";
import { TeamCreator } from "@/elements/forms/team/create/TeamCreator.js";
import { routerAuthCheck } from "@/tools/routerAuthCheck.js";

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
