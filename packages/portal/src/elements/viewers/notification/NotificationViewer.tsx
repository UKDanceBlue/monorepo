import { NotificationPreview } from "@elements/components/NotificationPreview";
import { SingleNotificationFragment } from "@elements/forms/notification/SingleNotificationGQL";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { Descriptions, Empty } from "antd";
import { DateTime } from "luxon";

function renderDateTime(
  dateTime: string | Date | null | undefined,
  formatOpts?: Intl.DateTimeFormatOptions
) {
  if (!dateTime) {
    return "Never";
  }

  return typeof dateTime === "string"
    ? DateTime.fromISO(dateTime).toLocaleString(formatOpts)
    : DateTime.fromJSDate(dateTime).toLocaleString(formatOpts);
}

export const NotificationViewer = ({
  notificationFragment,
}: {
  notificationFragment?: FragmentType<typeof SingleNotificationFragment> | null;
}) => {
  const notification = getFragmentData(
    SingleNotificationFragment,
    notificationFragment
  );

  if (!notification) {
    return <Empty description="Notification not found" />;
  }
  let deliveryIssueText = "No";
  if (notification.deliveryIssue) {
    deliveryIssueText = notification.deliveryIssue;
  }
  if (notification.deliveryIssueAcknowledgedAt) {
    deliveryIssueText += ` (Acknowledged at ${renderDateTime(
      notification.deliveryIssueAcknowledgedAt,
      DateTime.DATETIME_SHORT
    )})`;
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
      <h2>Notification Overview</h2>
      <NotificationPreview
        title={notification.title}
        body={notification.body}
      />
      <Descriptions
        title="Notification Details"
        size="small"
        items={[
          { label: "Title", span: 2, children: notification.title },
          { label: "Body", span: 2, children: notification.body },
          {
            label: "Delivery issue",
            span: 1,
            children: deliveryIssueText,
          },
          {
            label: "Scheduled to be sent at",
            span: 1,
            children: renderDateTime(
              notification.sendAt,
              DateTime.DATETIME_SHORT
            ),
          },
          {
            label: "Started sending at",
            span: 1,
            children: renderDateTime(
              notification.startedSendingAt,
              DateTime.DATETIME_SHORT
            ),
          },
          {
            label: "Created at",
            span: 1,
            children: renderDateTime(
              notification.createdAt,
              DateTime.DATETIME_SHORT
            ),
          },
        ]}
        column={2}
        bordered
      />
    </div>
  );
};
