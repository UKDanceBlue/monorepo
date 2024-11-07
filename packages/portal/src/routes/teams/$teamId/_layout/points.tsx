import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { Flex } from "antd";
import { useQuery } from "urql";

import { teamPageDocument } from "#documents/teamPageDocument.js";
import { PointEntryCreator } from "#elements/forms/point-entry/create/PointEntryCreator.js";
import { PointEntryTable } from "#elements/tables/point-entry/PointEntryTable.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

function ViewTeamPoints() {
  const { teamId: teamUuid } = Route.useParams();

  const canAddPoints = useAuthorizationRequirement(
    {
      committeeIdentifier: CommitteeIdentifier.viceCommittee,
      accessLevel: AccessLevel.CommitteeChairOrCoordinator,
    },
    {
      accessLevel: AccessLevel.Admin,
    }
  );

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
      {canAddPoints && (
        <div style={{ flex: 1 }}>
          <h2>Create Point Entry</h2>
          <PointEntryCreator
            team={data?.team.data}
            refetch={() => refetch({ requestPolicy: "network-only" })}
          />
        </div>
      )}
    </Flex>
  );
}

export const Route = createFileRoute("/teams/$teamId/_layout/points")({
  component: ViewTeamPoints,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.UKY,
      },
    ],
  },
});
