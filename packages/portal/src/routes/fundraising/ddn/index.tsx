import { UploadOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";
import { Button, Flex } from "antd";

import { DDNTable } from "@/elements/tables/fundraising/DDNTable";

export const Route = createFileRoute("/fundraising/ddn/")({
  component: RouteComponent,
  staticData: {
    authorizationRules: [
      {
        minCommitteeRole: CommitteeRole.Coordinator,
        committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee],
      },
      {
        accessLevel: AccessLevel.Admin,
      },
    ],
  },
});

function RouteComponent() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <h1>DDNs</h1>
        <div style={{ display: "flex", gap: 16 }}>
          <Link from="/fundraising/ddn" to="upload">
            <Button icon={<UploadOutlined />} size="large">
              Upload a DDN
            </Button>
          </Link>
        </div>
      </Flex>
      <DDNTable />
    </>
  );
}
