import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Flex } from "antd";

import { TeamsTable } from "#elements/tables/TeamsTable.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

export function ListTeamsPage() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Teams</h1>
        {useAuthorizationRequirement("create", "TeamNode") && (
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
      <TeamsTable />
    </>
  );
}

export const Route = createFileRoute("/teams/")({
  component: ListTeamsPage,
});
