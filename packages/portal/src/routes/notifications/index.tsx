import { PlusOutlined } from "@ant-design/icons";
import { NotificationsTable } from "@elements/tables/notification/NotificationsTable";
import { createFileRoute, Link } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
import { Button, Flex, Typography } from "antd";

function ListNotificationsPage() {
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>Notifications</Typography.Title>
        <Link from="/notifications" to="create">
          <Button icon={<PlusOutlined />} size="large">
            New Notification
          </Button>
        </Link>
      </Flex>
      <NotificationsTable />
    </>
  );
}

export const Route = createFileRoute("/notifications/")({
  component: ListNotificationsPage,
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
