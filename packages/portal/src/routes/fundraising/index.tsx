import { BarsOutlined, FileOutlined, UploadOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "antd";

import { FundraisingEntriesTable } from "#elements/tables/fundraising/FundraisingEntriesTable";

export const Route = createFileRoute("/fundraising/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <List
      title="Fundraising Entries"
      headerButtons={
        <>
          <Link from="/fundraising" to="ddn">
            <Button icon={<BarsOutlined />} size="large">
              View Raw DDNs
            </Button>
          </Link>
          <Link from="/fundraising" to="report">
            <Button icon={<FileOutlined />} size="large">
              Generate Report
            </Button>
          </Link>
          <Link from="/fundraising" to="ddn/upload">
            <Button icon={<UploadOutlined />} size="large">
              Upload a DDN
            </Button>
          </Link>
        </>
      }
    >
      <FundraisingEntriesTable showSolicitationCode />
    </List>
  );
}
