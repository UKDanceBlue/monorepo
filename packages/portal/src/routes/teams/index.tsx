import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";
import { Button, Flex } from "antd";

import { useMarathon } from "#config/marathonContext.js";
import { TeamsTable } from "#elements/tables/TeamsTable.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

export function ListTeamsPage() {
  const selectedMarathon = useMarathon();

  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Teams</h1>
        {useAuthorizationRequirement(
          {
            accessLevel: AccessLevel.Admin,
          },
          {
            committeeIdentifiers: [
              CommitteeIdentifier.dancerRelationsCommittee,
            ],
            minCommitteeRole: CommitteeRole.Coordinator,
          }
        ) && (
          <div style={{ display: "flex", gap: 16 }}>
            <Link from="/teams" to="create">
              <Button icon={<PlusOutlined />} size="large">
                Create Team
              </Button>
            </Link>
            <Link from="/teams" to="bulk">
              <Button icon={<UploadOutlined />} size="large">
                Bulk Create Teams
              </Button>
            </Link>
          </div>
        )}
      </Flex>
      <TeamsTable selectedMarathonId={selectedMarathon?.id} />
    </>
  );
}

export const Route = createFileRoute("/teams/")({
  component: ListTeamsPage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Committee,
      },
    ],
  },
});
