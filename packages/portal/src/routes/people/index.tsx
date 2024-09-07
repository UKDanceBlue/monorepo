import { PlusOutlined } from "@ant-design/icons";
import { PeopleTable } from "@elements/tables/PeopleTable";
import { createFileRoute, Link } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
import { Button, Flex, Typography } from "antd";

function ListPeoplePage() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>People</Typography.Title>
        <Link from="/people" to="create">
          <Button icon={<PlusOutlined />} size="large">
            Add Person
          </Button>
        </Link>
      </Flex>
      <PeopleTable />
    </>
  );
}

export const Route = createFileRoute("/people/")({
  component: ListPeoplePage,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      },
    ],
  },
});