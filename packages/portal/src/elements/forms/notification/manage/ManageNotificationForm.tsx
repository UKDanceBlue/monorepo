import { LuxonDatePicker } from "@elements/components/antLuxonComponents";
import { useAntFeedback } from "@hooks/useAntFeedback";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { Button, Empty, Flex, Form, Typography } from "antd";
import { DateTime } from "luxon";
import { useState } from "react";
import type { UseQueryExecute } from "urql";

import { NotificationPreview } from "../../../components/NotificationPreview";

import { NotificationManagerFragment } from "./NotificationManagerGQL";
import { useNotificationManagerForm } from "./useNotificationManager";

export const ManageNotificationForm = ({
  notificationFragment,
  refetchNotification,
}: {
  notificationFragment?: FragmentType<
    typeof NotificationManagerFragment
  > | null;
  refetchNotification: UseQueryExecute;
}) => {
  const notification = getFragmentData(
    NotificationManagerFragment,
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
        if (result.data?.[responseKey].ok) {
          await showInfoMessage(`${operationText} successful`);
          refetchNotification();
        } else {
          await showErrorMessage(`${operationText} failed`);
        }
      })
      .catch(() => {
        void showErrorMessage(`${operationText} failed`);
      });
  }

  return (
    <>
      <NotificationPreview
        title={notification.title}
        body={notification.body}
      />
      <Flex justify="space-between" align="center">
        <Typography.Title level={2}>{notification.title}</Typography.Title>
        <Form layout="vertical">
          <Form.Item label="Send At">
            <LuxonDatePicker
              value={sendAt}
              onChange={(value) => setSendAt(value)}
              showTime
              format="yyyy-MM-dd HH:mm"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              disabled={!sendAt}
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
