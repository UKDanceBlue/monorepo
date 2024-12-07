import { createFileRoute } from "@tanstack/react-router";

import { BulkTeamCreator } from "#elements/forms/team/create/BulkTeamCreator.js";

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
});
