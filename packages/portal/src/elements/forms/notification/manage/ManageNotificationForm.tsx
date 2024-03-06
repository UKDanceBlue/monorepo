import { LuxonDatePicker } from "@elements/components/antLuxonComponents";
import { NotificationViewer } from "@elements/viewers/notification/NotificationViewer";
import { useAntFeedback } from "@hooks/useAntFeedback";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { Button, Empty, Flex, Form } from "antd";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import type { UseQueryExecute } from "urql";

import { SingleNotificationFragment } from "../SingleNotificationGQL";

import { useNotificationManagerForm } from "./useNotificationManager";

export const ManageNotificationForm = ({
  notificationFragment,
  refetchNotification,
}: {
  notificationFragment?: FragmentType<typeof SingleNotificationFragment> | null;
  refetchNotification: UseQueryExecute;
}) => {
  const notification = getFragmentData(
    SingleNotificationFragment,
    notificationFragment
  );
  const actions = useNotificationManagerForm({
    uuid: notification?.uuid ?? "",
  });

  const [sendAt, setSendAt] = useState<DateTime | null>(
    notification?.sendAt
      ? typeof notification.sendAt === "string"
        ? DateTime.fromISO(notification.sendAt)
        : DateTime.fromJSDate(notification.sendAt)
      : null
  );

  const { showErrorMessage, showInfoMessage } = useAntFeedback();

  useEffect(() => {
    const interval = setInterval(() => {
      refetchNotification({ requestPolicy: "network-only" });
    }, 5000);
    return () => clearInterval(interval);
  }, [refetchNotification]);

  if (!notification || !actions) {
    return <Empty description="Notification not found" />;
  }

  const {
    sendNotification,
    scheduleNotification,
    cancelNotificationSchedule,
    deleteNotification,
  } = actions;

  function handleOperationResult<T extends string>(
    promise: Promise<{ data?: Record<T, { ok: boolean }> | undefined }>,
    responseKey: T,
    operationText: string
  ) {
    promise
      .then(async (result) => {
        refetchNotification({ requestPolicy: "network-only" });
        await (result.data?.[responseKey].ok
          ? showInfoMessage(`${operationText} successful`)
          : showErrorMessage(`${operationText} failed`));
      })
      .catch((error) => {
        console.error(error);
        void showErrorMessage(`${operationText} failed`);
      });
  }

  return (
    <>
      <Flex justify="space-between" align="center" gap={16}>
        <NotificationViewer notificationFragment={notificationFragment} />
        <Form layout="vertical">
          <Form.Item label="Schedule the notification">
            <LuxonDatePicker
              disabled={
                notification.startedSendingAt !== null || !!notification.sendAt
              }
              value={sendAt}
              onChange={(value) => setSendAt(value)}
              showTime
              format="yyyy-MM-dd HH:mm"
            />
            <Button
              type="primary"
              disabled={
                !sendAt ||
                notification.startedSendingAt !== null ||
                !!notification.sendAt
              }
              onClick={() => {
                if (sendAt) {
                  handleOperationResult(
                    scheduleNotification(sendAt),
                    "scheduleNotification",
                    "Schedule"
                  );
                }
              }}
            >
              Schedule
            </Button>
          </Form.Item>
          <Form.Item label="Send the notification now">
            <Button
              type="primary"
              disabled={notification.startedSendingAt !== null}
              onClick={() =>
                handleOperationResult(
                  sendNotification(),
                  "sendNotification",
                  "Send"
                )
              }
            >
              Send
            </Button>
          </Form.Item>
          <Form.Item label="Cancel a scheduled notification">
            <Button
              type="primary"
              disabled={!notification.sendAt}
              onClick={() =>
                handleOperationResult(
                  cancelNotificationSchedule(),
                  "abortScheduledNotification",
                  "Cancel"
                )
              }
            >
              Cancel
            </Button>
          </Form.Item>
          <Form.Item label="Delete the notification">
            <Button
              type="primary"
              danger
              disabled={notification.startedSendingAt !== null}
              onClick={() =>
                handleOperationResult(
                  deleteNotification(),
                  "deleteNotification",
                  "Delete"
                )
              }
            >
              Delete
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
};
