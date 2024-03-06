import { PlusOutlined } from "@ant-design/icons";
import { NotificationsTable } from "@elements/tables/notification/NotificationsTable";
import { useNavigate } from "@tanstack/react-router";
import { Button, Flex, Typography } from "antd";

export function ListNotificationsPage() {
  const navigate = useNavigate();
  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>Notifications</Typography.Title>
        <Button
          type="link"
          icon={<PlusOutlined />}
          onClick={() => void navigate({ to: "/notifications/create" })}
          size="large"
        >
          New Notification
        </Button>
      </Flex>
      <NotificationsTable />
    </>
  );
}
