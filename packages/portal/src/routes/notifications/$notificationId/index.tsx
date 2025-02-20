import { SendOutlined } from "@ant-design/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Flex, Typography } from "antd";

import { SingleNotificationFragment } from "#documents/notification.js";
import { NotificationDeliveriesTable } from "#elements/tables/notification/NotificationDeliveriesTable.js";
import { NotificationViewer } from "#elements/viewers/notification/NotificationViewer.js";
import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { useQuery } from "#hooks/useTypedRefine.js";

const notificationViewerDocument = graphql(
  /* GraphQL */ `
    query NotificationViewer($id: GlobalId!) {
      notification(id: $id) {
        ...SingleNotificationFragment
      }
    }
  `,
  [SingleNotificationFragment]
);

function ViewNotificationPage() {
  const { notificationId } = Route.useParams();

  const [{ data, fetching, error }] = useQuery({
    query: notificationViewerDocument,
    variables: { id: notificationId },
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
          <Button type="link" icon={<SendOutlined />}>
            Manage delivery
          </Button>
        </Link>
      </Flex>
      <NotificationViewer notificationFragment={data?.notification} />
      <NotificationDeliveriesTable notificationUuid={notificationId} />
    </Flex>
  );
}

export const Route = createFileRoute("/notifications/$notificationId/")({
  component: ViewNotificationPage,
  async beforeLoad({ context, params: { notificationId } }) {
    await context.urqlClient.query(notificationViewerDocument, {
      id: notificationId,
    });
  },
});
