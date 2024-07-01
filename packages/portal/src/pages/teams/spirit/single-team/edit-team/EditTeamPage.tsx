import { TeamEditor } from "@elements/forms/team/edit/TeamEditor";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

const viewTeamPageDocument = graphql(/* GraphQL */ `
  query EditTeamPage($uuid: GlobalId!) {
    team(uuid: $uuid) {
      data {
        ...TeamEditorFragment
      }
    }
  }
`);

export function EditTeamPage() {
  const { teamId } = useParams({ from: "/teams/$teamId/edit" });

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
      <TeamEditor teamFragment={data?.team.data} refetchTeam={refetchTeam} />
    </div>
  );
}
