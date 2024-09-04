import { SendOutlined } from "@ant-design/icons";
import { NotificationDeliveriesTable } from "@elements/tables/notification/NotificationDeliveriesTable";
import { NotificationViewer } from "@elements/viewers/notification/NotificationViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { Button, Flex, Typography } from "antd";
import { useQuery } from "urql";

const notificationViewerDocument = graphql(/* GraphQL */ `
  query NotificationViewer($uuid: GlobalId!) {
    notification(uuid: $uuid) {
      data {
        ...SingleNotificationFragment
      }
    }
  }
`);

function ViewNotificationPage() {
  const { notificationId } = useParams({
    from: "/notifications/$notificationId/",
  });

  const [{ data, fetching, error }, refetch] = useQuery({
    query: notificationViewerDocument,
    variables: { uuid: notificationId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading notification...",
  });

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <Typography.Title>Notification</Typography.Title>
        <Link from="/notifications/$notificationId" to="manage">
          <Button type="link" icon={<SendOutlined />} size="large">
            Manage delivery
          </Button>
        </Link>
      </Flex>
      <NotificationViewer
        notificationFragment={data?.notification.data}
        refetch={refetch}
      />
      <NotificationDeliveriesTable notificationUuid={notificationId} />
    </Flex>
  );
}

export const Route = createFileRoute("/notifications/$notificationId/")({
  component: ViewNotificationPage,
});
