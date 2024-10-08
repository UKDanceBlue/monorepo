import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { PeopleTable } from "@elements/tables/PeopleTable";
import { useAuthorizationRequirement } from "@hooks/useLoginState";
import { createFileRoute, Link } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
import { Button, Flex, Typography } from "antd";

function ListPeoplePage() {
  const canCreate = useAuthorizationRequirement(AccessLevel.Admin);
  const canBulkCreate = useAuthorizationRequirement(AccessLevel.SuperAdmin);

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>People</Typography.Title>
        <div style={{ display: "flex", gap: 16 }}>
          {canCreate && (
            <Link from="/people" to="create">
              <Button icon={<PlusOutlined />} size="large">
                Add Person
              </Button>
            </Link>
          )}
          {canBulkCreate && (
            <Link from="/people" to="bulk">
              <Button icon={<UploadOutlined />} size="large">
                Bulk Add People
              </Button>
            </Link>
          )}
        </div>
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
