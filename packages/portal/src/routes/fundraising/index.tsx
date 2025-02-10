import {
  BarsOutlined,
  FileOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "antd";

import { FundraisingEntriesTable } from "#elements/tables/fundraising/FundraisingEntriesTable";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";

export const Route = createFileRoute("/fundraising/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <List
      title="Fundraising Entries"
      headerButtons={
        <>
          {useAuthorizationRequirement("create", {
            kind: "FundraisingEntryNode",
          }) && (
            <Link from="/fundraising" to="create">
              <Button icon={<PlusOutlined />} size="large">
                Create Entry
              </Button>
            </Link>
          )}
          {useAuthorizationRequirement("list", {
            kind: "DailyDepartmentNotificationNode",
          }) && (
            <Link from="/fundraising" to="ddn">
              <Button icon={<BarsOutlined />} size="large">
                View Raw DDNs
              </Button>
            </Link>
          )}
          {useAuthorizationRequirement("create", {
            kind: "DailyDepartmentNotificationNode",
          }) && (
            <Link from="/fundraising" to="ddn/upload">
              <Button icon={<UploadOutlined />} size="large">
                Upload a DDN
              </Button>
            </Link>
          )}
          {useAuthorizationRequirement("list", {
            kind: "FundraisingEntryNode",
          }) && (
            <Link from="/fundraising" to="report">
              <Button icon={<FileOutlined />} size="large">
                Generate Report
              </Button>
            </Link>
          )}
        </>
      }
    >
      <FundraisingEntriesTable showSolicitationCode />
    </List>
  );
}
