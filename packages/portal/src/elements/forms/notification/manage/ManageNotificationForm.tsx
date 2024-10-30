import type { ModalFuncProps } from "antd";
import { Button, Empty, Flex, Form } from "antd";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import type { UseQueryExecute } from "urql";

import { LuxonDatePicker } from "#elements/components/antLuxonComponents";
import { NotificationViewer } from "#elements/viewers/notification/NotificationViewer";
import type { FragmentType } from "#graphql/index.js";
import { getFragmentData } from "#graphql/index.js";
import { useAntFeedback } from "#hooks/useAntFeedback";

import { SingleNotificationFragment } from "../SingleNotificationGQL";
import { useNotificationManagerForm } from "./useNotificationManager";

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
      .catch((error: unknown) => {
        console.error(error);
        void showErrorMessage(`${operationText} failed`);
      });
  }

  return (
    <>
      <Flex justify="space-between" align="center" gap={16}>
        <NotificationViewer
          notificationFragment={notificationFragment}
          refetch={() => undefined}
        />
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
                    title:
                      "!STOP! Are you sure you would like to schedule the notification? !STOP!",
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
              disabled={notification.startedSendingAt !== null}
              onClick={() => {
                void showWarningModal({
                  ...confirmationModalProps,
                  title:
                    "!STOP! Are you sure you would like to send the notification? !STOP!",
                  content:
                    "This will immediately send the notification to ${notification.deliveryCount} recipients. There is no way to cancel this operation.",
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
