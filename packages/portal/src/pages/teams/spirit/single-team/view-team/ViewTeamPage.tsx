import { TeamViewer } from "@elements/viewers/team/TeamViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { Outlet, useParams } from "@tanstack/react-router";
import { Flex } from "antd";
import { useQuery } from "urql";

import { teamPageDocument } from "./teamPageDocument";


export function ViewTeamPage() {
  const { teamId: teamUuid } = useParams({ from: "/teams/$teamId/" });

  const [{ fetching, data, error }] = useQuery({
    query: teamPageDocument,
    variables: { teamUuid },
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
        <TeamViewer teamFragment={data?.team.data} />
        <Outlet />
      </Flex>
    </div>
  );
}
