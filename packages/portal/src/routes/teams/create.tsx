import { createFileRoute } from "@tanstack/react-router";

import { useMarathon } from "#config/marathonContext.js";
import { TeamCreator } from "#elements/forms/team/create/TeamCreator.js";

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
});
