import { PointEntryCreator } from "@elements/forms/point-entry/create/PointEntryCreator";
import { PointEntryTable } from "@elements/tables/point-entry/PointEntryTable";
import { TeamViewer } from "@elements/viewers/team/TeamViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Flex } from "antd";
import { useQuery } from "urql";

const teamPageDocument = graphql(/* GraphQL */ `
  query ViewTeamPage($teamUuid: String!) {
    team(uuid: $teamUuid) {
      data {
        ...TeamViewerFragment
        pointEntries {
          ...PointEntryTableFragment
        }
      }
    }
  }
`);

export function ViewTeamPage() {
  const { teamId: teamUuid } = useParams({ from: "/teams/$teamId/" });

  const [{ fetching, data, error }, refetch] = useQuery({
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
        <Flex gap="1em">
          <div style={{ flex: 1 }}>
            <h2>Point Entries</h2>
            <PointEntryTable
              loading={fetching}
              refetch={refetch}
              teamFragment={data?.team.data.pointEntries}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h2>Create Point Entry</h2>
            <PointEntryCreator teamUuid={teamUuid} refetch={refetch} />
          </div>
        </Flex>
      </Flex>
    </div>
  );
}
