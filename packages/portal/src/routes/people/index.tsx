import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AccessLevel, Action } from "@ukdanceblue/common";
import { Button, Flex, Typography } from "antd";

import { PeopleTable } from "#elements/tables/PeopleTable.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

function ListPeoplePage() {
  const canCreate = useAuthorizationRequirement("create", "PersonNode");

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>People</Typography.Title>
        <div style={{ display: "flex", gap: 16 }}>
          {canCreate && (
            <>
              <Link from="/people" to="create">
                <Button icon={<PlusOutlined />} size="large">
                  Add Person
                </Button>
              </Link>
              <Link from="/people" to="bulk">
                <Button icon={<UploadOutlined />} size="large">
                  Bulk Add People
                </Button>
              </Link>
            </>
          )}
        </div>
      </Flex>
      <PeopleTable />
    </>
  );
}

export const Route = createFileRoute("/people/")({
  component: ListPeoplePage,

  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      },
    ],
  },
});
