import { teamPageDocument } from "../teamPageDocument";

import { PointEntryCreator } from "@elements/forms/point-entry/create/PointEntryCreator";
import { PointEntryTable } from "@elements/tables/point-entry/PointEntryTable";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { Flex } from "antd";
import { useQuery } from "urql";


export function ViewTeamPoints() {
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
        <PointEntryCreator
          teamUuid={teamUuid}
          refetch={() => refetch({ requestPolicy: "network-only" })}
        />
      </div>
    </Flex>
  );
}
