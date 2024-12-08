import type { DateTime } from "luxon";
import { useMutation } from "urql";

import {
  cancelNotificationScheduleDocument,
  deleteNotificationDocument,
  scheduleNotificationDocument,
  sendNotificationDocument,
} from "#documents/notification.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

export const useNotificationManagerForm = ({
  uuid,
}: {
  uuid?: string | undefined | null;
}) => {
  const [
    { fetching: cancelFetching, error: cancelError },
    cancelNotificationSchedule,
  ] = useMutation(cancelNotificationScheduleDocument);
  const [{ fetching: deleteFetching, error: deleteError }, deleteNotification] =
    useMutation(deleteNotificationDocument);
  const [
    { fetching: scheduleFetching, error: scheduleError },
    scheduleNotification,
  ] = useMutation(scheduleNotificationDocument);
  const [{ fetching: sendFetching, error: sendError }, sendNotification] =
    useMutation(sendNotificationDocument);

  useQueryStatusWatcher({
    error: cancelError,
    fetching: cancelFetching,
    loadingMessage: "Cancelling notification...",
  });
  useQueryStatusWatcher({
    error: deleteError,
    fetching: deleteFetching,
    loadingMessage: "Deleting notification...",
  });
  useQueryStatusWatcher({
    error: scheduleError,
    fetching: scheduleFetching,
    loadingMessage: "Scheduling notification...",
  });
  useQueryStatusWatcher({
    error: sendError,
    fetching: sendFetching,
    loadingMessage: "Sending notification...",
  });

  return uuid
    ? {
        sendNotification: () => sendNotification({ id: uuid }),
        scheduleNotification: (sendAt: DateTime) => {
          const sendAtISO = sendAt.toISO();
          if (!sendAtISO) {
            throw new Error("Invalid sendAt date");
          }
          return scheduleNotification({ id: uuid, sendAt: sendAtISO });
        },
        cancelNotificationSchedule: () =>
          cancelNotificationSchedule({ id: uuid }),
        deleteNotification: (force = false) =>
          deleteNotification({ id: uuid, force }),
      }
    : undefined;
};
