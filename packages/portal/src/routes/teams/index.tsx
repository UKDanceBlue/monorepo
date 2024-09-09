import { PlusOutlined } from "@ant-design/icons";
import { useMarathon } from "@config/marathonContext";
import { TeamsTable } from "@elements/tables/TeamsTable";
import { createFileRoute, Link } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
import { Button, Flex } from "antd";

export function ListTeamsPage() {
  const selectedMarathon = useMarathon();

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
