import { PlusOutlined } from "@ant-design/icons";
import { TeamsTable } from "@elements/tables/TeamsTable";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Flex } from "antd";

export function ListTeamsPage() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>Teams</h1>
        <Link from="/teams" to="create">
          <Button icon={<PlusOutlined />} size="large">
            Create Team
          </Button>
        </Link>
      </Flex>
      <TeamsTable />
    </>
  );
}

export const Route = createFileRoute("/teams/")({
  component: ListTeamsPage,
});
