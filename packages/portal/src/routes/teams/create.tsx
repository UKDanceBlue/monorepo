import { TeamCreator } from "@elements/forms/team/create/TeamCreator";
import { createFileRoute } from "@tanstack/react-router";

function CreateTeamPage() {
  return (
    <div>
      <h1>Create Team</h1>
      <TeamCreator />
    </div>
  );
}

export const Route = createFileRoute("/teams/create")({
  component: CreateTeamPage,
});
