import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { Flex } from "antd";
import { useQuery } from "#hooks/useTypedRefine.ts";

import { teamPageDocument } from "#documents/team.js";
import { TeamViewer } from "#elements/viewers/team/TeamViewer.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.ts";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

function ViewTeamPage() {
  const { teamId: teamUuid } = Route.useParams();
  const canSeePoints = useAuthorizationRequirement("read", "PointEntryNode");

  const [{ fetching, data, error }] = useQuery({
    query: teamPageDocument,
    variables: { teamUuid, inclidePointEntries: canSeePoints },
  });
  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading point entries...",
  });

  return (
    <div>
      <h1>View Team</h1>
      <Flex gap="1em" vertical>
        <h2>Team Details</h2>
        <TeamViewer teamFragment={data?.team} />
        <Outlet />
      </Flex>
    </div>
  );
}

export const Route = createFileRoute("/teams/$teamId/_layout")({
  component: ViewTeamPage,
  async beforeLoad({ context, params: { teamId } }) {
    await context.urqlClient.query(teamPageDocument, {
      teamUuid: teamId,
    });
  },
});
