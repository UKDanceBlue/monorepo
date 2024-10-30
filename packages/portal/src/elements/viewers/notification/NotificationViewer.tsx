import { Descriptions, Empty } from "antd";
import { DateTime } from "luxon";
import { useEffect } from "react";
import type { UseQueryExecute } from "urql";

import { NotificationPreview } from "#elements/components/notification/NotificationPreview";
import { SingleNotificationFragment } from "#elements/forms/notification/SingleNotificationGQL";
import type { FragmentType } from "#graphql/index.js";
import { getFragmentData } from "#graphql/index.js";
import { renderDateTime } from "#tools/luxonTools";

export const NotificationViewer = ({
  notificationFragment,
  refetch,
}: {
  notificationFragment?: FragmentType<typeof SingleNotificationFragment> | null;
  refetch: UseQueryExecute;
}) => {
  const notification = getFragmentData(
    SingleNotificationFragment,
    notificationFragment
  );

  useEffect(() => {
    setInterval(() => {
      refetch({ requestPolicy: "network-only" });
    }, 10_000);
  }, [refetch]);

  if (!notification) {
    return <Empty description="Notification not found" />;
  }
  let deliveryIssueText = "No";
  if (notification.deliveryIssue) {
    deliveryIssueText = `${notification.deliveryIssue} - PLEASE CONTACT TECH`;
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
