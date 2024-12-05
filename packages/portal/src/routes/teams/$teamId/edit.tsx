import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { useQuery } from "urql";

import { TeamEditorFragment } from "#documents/team.ts";
import { TeamEditor } from "#elements/forms/team/edit/TeamEditor.js";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const viewTeamPageDocument = graphql(
  /* GraphQL */ `
    query EditTeamPage($uuid: GlobalId!) {
      team(uuid: $uuid) {
        ...TeamEditorFragment
      }
    }
  `,
  [TeamEditorFragment]
);

function EditTeamPage() {
  const { teamId } = Route.useParams();

  const [{ data, fetching, error }, refetchTeam] = useQuery({
    query: viewTeamPageDocument,
    variables: { uuid: teamId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading team...",
  });

  return (
    <div>
      <h1>Edit Team</h1>
      <TeamEditor teamFragment={data?.team} refetchTeam={refetchTeam} />
    </div>
  );
}

export const Route = createFileRoute("/teams/$teamId/edit")({
  component: EditTeamPage,
  async beforeLoad({ context, params: { teamId } }) {
    await context.urqlClient.query(viewTeamPageDocument, { uuid: teamId });
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
