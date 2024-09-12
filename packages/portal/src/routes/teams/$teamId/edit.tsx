import { TeamEditor } from "@elements/forms/team/edit/TeamEditor";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
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
      <TeamEditor teamFragment={data?.team.data} refetchTeam={refetchTeam} />
    </div>
  );
}

export const Route = createFileRoute("/teams/$teamId/edit")({
  component: EditTeamPage,
  async beforeLoad({ context, params: { teamId } }) {
    await context.urqlClient.query(viewTeamPageDocument, { uuid: teamId });
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
