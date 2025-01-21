import type { ModalFuncProps } from "antd";
import { Button, Empty, Flex, Form } from "antd";
import { DateTime } from "luxon";
import { useState } from "react";

import { SingleNotificationFragment } from "#documents/notification.js";
import { LuxonDatePicker } from "#elements/components/antLuxonComponents.js";
import { NotificationViewer } from "#elements/viewers/notification/NotificationViewer.js";
import type { FragmentOf } from "#gql/index.js";
import { readFragment } from "#gql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback.js";

import { useNotificationManagerForm } from "./useNotificationManager.js";

const confirmationModalProps: ModalFuncProps = {
  okText: "Yes",
  cancelText: "No",
  autoFocusButton: "cancel",
  cancelButtonProps: { danger: false },
  okButtonProps: { danger: true },
  onCancel: () => undefined,
  closable: true,
  maskClosable: true,
};

export const ManageNotificationForm = ({
  notificationFragment,
}: {
  notificationFragment?:
    | FragmentOf<typeof SingleNotificationFragment>
    | undefined
    | null;
}) => {
  const notification = readFragment(
    SingleNotificationFragment,
    notificationFragment
  );
  const actions = useNotificationManagerForm({
    uuid: notification?.id ?? "",
  });

  const [sendAt, setSendAt] = useState<DateTime | null>(
    notification?.sendAt
      ? typeof notification.sendAt === "string"
        ? DateTime.fromISO(notification.sendAt)
        : DateTime.fromJSDate(notification.sendAt)
      : null
  );

  const {
    showErrorMessage,
    showInfoMessage,
    showWarningModal,
    showConfirmModal,
  } = useAntFeedback();

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
    promise: Promise<{ data?: Record<T, unknown> | undefined }>,
    responseKey: T,
    operationText: string
  ) {
    promise
      .then(async (result) => {
        await (result.data?.[responseKey]
          ? showInfoMessage(`${operationText} successful`)
          : showErrorMessage(`${operationText} failed`));
      })
      .catch((error: unknown) => {
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
                  void showConfirmModal({
                    ...confirmationModalProps,
                    title: (
                      <p style={{ textAlign: "center" }}>
                        !STOP!
                        <p>
                          Are you sure you would like to <i>schedule</i> the
                          notification?
                        </p>
                        !STOP!
                      </p>
                    ),
                    content: `This will send the notification to ${notification.deliveryCount} specified recipients on ${sendAt.toLocaleString(
                      DateTime.DATE_MED_WITH_WEEKDAY
                    )} at ${sendAt.toLocaleString(DateTime.TIME_SIMPLE)}.`,
                    onOk: () => {
                      handleOperationResult(
                        scheduleNotification(sendAt),
                        "scheduleNotification",
                        "Schedule"
                      );
                    },
                  });
                }
              }}
            >
              Schedule
            </Button>
          </Form.Item>
          <Form.Item label="Send the notification now">
            <Button
              type="primary"
              disabled={
                notification.startedSendingAt !== null || !!notification.sendAt
              }
              title={
                notification.sendAt
                  ? "This notification is scheduled, cancel the schedule to send now"
                  : undefined
              }
              onClick={() => {
                void showWarningModal({
                  ...confirmationModalProps,
                  icon: null,
                  title: (
                    <p style={{ textAlign: "center" }}>
                      !STOP!
                      <p>
                        Are you sure you would like to <i>send</i> the
                        notification?
                      </p>
                      !STOP!
                    </p>
                  ),
                  content: `This will immediately send the notification to ${notification.deliveryCount} recipients. There is no way to cancel this operation.`,
                  onOk: () => {
                    handleOperationResult(
                      sendNotification(),
                      "sendNotification",
                      "Send"
                    );
                  },
                });
              }}
            >
              Send
            </Button>
          </Form.Item>
          <Form.Item label="Cancel a scheduled notification">
            <Button
              type="primary"
              disabled={!notification.sendAt}
              onClick={() => {
                void showWarningModal({
                  ...confirmationModalProps,
                  title:
                    "Are you sure you would like to cancel the scheduled notification?",
                  content:
                    "This will cancel the scheduled notification. It will not be sent to any recipients.",
                  onOk: () => {
                    handleOperationResult(
                      cancelNotificationSchedule(),
                      "abortScheduledNotification",
                      "Cancel"
                    );
                  },
                });
              }}
            >
              Cancel
            </Button>
          </Form.Item>
          <Form.Item label="Delete the notification">
            <Button
              type="primary"
              danger
              disabled={notification.startedSendingAt !== null}
              onClick={() => {
                void showWarningModal({
                  ...confirmationModalProps,
                  title:
                    "Are you sure you would like to delete the notification?",
                  content:
                    "This will permanently delete the notification. There is no way to recover it.",
                  onOk: () => {
                    handleOperationResult(
                      deleteNotification(),
                      "deleteNotification",
                      "Delete"
                    );
                  },
                });
              }}
            >
              Delete
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
};
