import { SendOutlined } from "@ant-design/icons";
import { NotificationDeliveriesTable } from "@elements/tables/notification/NotificationDeliveriesTable";
import { NotificationViewer } from "@elements/viewers/notification/NotificationViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useNavigate, useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Button, Flex, Typography } from "antd";
import { useQuery } from "urql";

const notificationViewerDocument = graphql(/* GraphQL */ `
  query NotificationViewer($uuid: String!) {
    notification(uuid: $uuid) {
      data {
        ...SingleNotificationFragment
      }
    }
  }
`);

export function ViewNotificationPage() {
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

  const navigate = useNavigate();

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <Typography.Title>Notification</Typography.Title>
        <Button
          type="link"
          icon={<SendOutlined />}
          onClick={() =>
            void navigate({
              to: "/notifications/$notificationId/manage",
            })
          }
          size="large"
        >
          Manage delivery
        </Button>
      </Flex>
      <NotificationViewer
        notificationFragment={data?.notification.data}
        refetch={refetch}
      />
      <NotificationDeliveriesTable notificationUuid={notificationId} />
    </Flex>
  );
}
