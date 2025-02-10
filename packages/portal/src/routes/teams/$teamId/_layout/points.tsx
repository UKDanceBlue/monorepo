import { createFileRoute } from "@tanstack/react-router";
import { Flex } from "antd";

import { teamPagePointsDocument } from "#documents/team.js";
import { PointEntryCreator } from "#elements/forms/point-entry/create/PointEntryCreator.js";
import { PointEntryTable } from "#elements/tables/point-entry/PointEntryTable.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { useQuery } from "#hooks/useTypedRefine.js";

function ViewTeamPoints() {
  const { teamId: teamUuid } = Route.useParams();

  const canAddPoints = useAuthorizationRequirement("create", "PointEntryNode");

  const [{ fetching, data, error }] = useQuery({
    query: teamPagePointsDocument,
    variables: { teamUuid, inclidePointEntries: true },
  });
  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading point entries...",
  });

  return (
    <Flex gap="1em" wrap="wrap">
      <div style={{ flex: 1 }}>
        <h2>Point Entries</h2>
        <PointEntryTable
          loading={fetching}
          teamFragment={data?.team.pointEntries}
        />
      </div>
      {canAddPoints && (
        <div style={{ flex: 1 }}>
          <h2>Create Point Entry</h2>
          <PointEntryCreator team={data?.team} />
        </div>
      )}
    </Flex>
  );
}

export const Route = createFileRoute("/teams/$teamId/_layout/points")({
  component: ViewTeamPoints,
});
