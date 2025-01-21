import { createFileRoute } from "@tanstack/react-router";

import { TeamEditorFragment } from "#documents/team.ts";
import { TeamEditor } from "#elements/forms/team/edit/TeamEditor.js";
import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { useQuery } from "#hooks/useTypedRefine.ts";

const viewTeamPageDocument = graphql(
  /* GraphQL */ `
    query EditTeamPage($id: GlobalId!) {
      team(id: $id) {
        ...TeamEditorFragment
      }
    }
  `,
  [TeamEditorFragment]
);

function EditTeamPage() {
  const { teamId } = Route.useParams();

  const [{ data, fetching, error }] = useQuery({
    query: viewTeamPageDocument,
    variables: { id: teamId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading team...",
  });

  return (
    <div>
      <h1>Edit Team</h1>
      <TeamEditor teamFragment={data?.team} />
    </div>
  );
}

export const Route = createFileRoute("/teams/$teamId/edit")({
  component: EditTeamPage,
  async beforeLoad({ context, params: { teamId } }) {
    await context.urqlClient.query(viewTeamPageDocument, { id: teamId });
  },
});
