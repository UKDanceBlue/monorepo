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

  const totalDeliveryIssues = Object.values(
    notification.deliveryIssueCount
  ).reduce<number>(
    (acc, val) => (val === "NotificationDeliveryIssueCount" ? acc : acc + val),
    0
  );

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
            label: "Scheduled to be sent at",
            span: 2,
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
          {
            label: "Notification problem",
            span: 1,
            children: deliveryIssueText,
          },
          {
            label: "Total number of notifications",
            span: 1,
            children: notification.deliveryCount,
          },
          {
            label: "Individual delivery issues",
            span: 2,
            children:
              totalDeliveryIssues === 0 ? (
                "No issues"
              ) : (
                <Descriptions
                  size="small"
                  items={Object.entries(notification.deliveryIssueCount)
                    .filter(([, val]) => typeof val === "number")
                    .map(([key, value]) => ({
                      label: key,
                      children:
                        value === "NotificationDeliveryIssueCount"
                          ? "No issues"
                          : value,
                    }))}
                />
              ),
          },
        ]}
        column={2}
        bordered
      />
    </div>
  );
};
