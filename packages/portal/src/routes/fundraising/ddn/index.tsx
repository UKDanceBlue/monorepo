import { UploadOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import {} from "@ukdanceblue/common";
import { Button } from "antd";

import { DDNTable } from "#elements/tables/fundraising/DDNTable";

export const Route = createFileRoute("/fundraising/ddn/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <List
      title="DDNs"
      headerButtons={
        <Link from="/fundraising/ddn" to="upload">
          <Button icon={<UploadOutlined />}>Upload a DDN</Button>
        </Link>
      }
    >
      <DDNTable />
    </List>
  );
}
