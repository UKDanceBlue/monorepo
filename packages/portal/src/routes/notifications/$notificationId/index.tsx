import { SendOutlined } from "@ant-design/icons";
import { NotificationDeliveriesTable } from "@elements/tables/notification/NotificationDeliveriesTable";
import { NotificationViewer } from "@elements/viewers/notification/NotificationViewer";
import { graphql } from "@graphql/index.js";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute, Link } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
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
  const { notificationId } = Route.useParams();

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
  async beforeLoad({ context, params: { notificationId } }) {
    await context.urqlClient.query(notificationViewerDocument, {
      uuid: notificationId,
    });
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
