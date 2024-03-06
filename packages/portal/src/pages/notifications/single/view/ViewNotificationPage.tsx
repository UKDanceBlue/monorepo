import { NotificationViewer } from "@elements/viewers/notification/NotificationViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
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

  const [{ data, fetching, error }] = useQuery({
    query: notificationViewerDocument,
    variables: { uuid: notificationId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading notification...",
  });

  return (
    <div>
      <h1>View Notification</h1>
      <NotificationViewer notificationFragment={data?.notification.data} />
    </div>
  );
}
