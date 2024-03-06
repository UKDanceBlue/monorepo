import { ManageNotificationForm } from "@elements/forms/notification/manage/ManageNotificationForm";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

const notificationManagerDocument = graphql(/* GraphQL */ `
  query NotificationManager($uuid: String!) {
    notification(uuid: $uuid) {
      data {
        ...SingleNotificationFragment
      }
    }
  }
`);

export function ManageNotificationPage() {
  const { notificationId } = useParams({
    from: "/notifications/$notificationId/manage",
  });

  const [{ data, fetching, error }, refetchNotification] = useQuery({
    query: notificationManagerDocument,
    variables: { uuid: notificationId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading notification...",
  });

  return (
    <div>
      <h1>Manage Notification</h1>
      <ManageNotificationForm
        notificationFragment={data?.notification.data}
        refetchNotification={refetchNotification}
      />
    </div>
  );
}
