import { PlusOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "antd";

import { NotificationsTable } from "#elements/tables/notification/NotificationsTable.js";

function ListNotificationsPage() {
  return (
    <List
      title="Notifications"
      headerButtons={
        <Link from="/notifications" to="create">
          <Button icon={<PlusOutlined />} size="large">
            New Notification
          </Button>
        </Link>
      }
    >
      <NotificationsTable />
    </List>
  );
}

export const Route = createFileRoute("/notifications/")({
  component: ListNotificationsPage,
});
