import type { NotificationProvider } from "@refinedev/core";

import { useAntFeedback } from "#hooks/useAntFeedback.ts";

import { UndoableNotification } from "./UndoableNotification";

export const useNotificationProvider = (): NotificationProvider => {
  const { appNotification } = useAntFeedback();

  const notificationProvider: NotificationProvider = {
    open: ({
      key,
      message,
      description,
      type,
      cancelMutation,
      undoableTimeout,
    }) => {
      if (type === "progress") {
        appNotification.open({
          key,
          description: (
            <UndoableNotification
              notificationKey={key}
              message={message}
              cancelMutation={() => {
                cancelMutation?.();
                appNotification.destroy(key ?? "");
              }}
              undoableTimeout={undoableTimeout}
            />
          ),
          message: null,
          duration: 0,
          closeIcon: <></>,
        });
      } else {
        appNotification.open({
          key,
          description: message,
          message: description ?? null,
          type,
        });
      }
    },
    close: (key) => appNotification.destroy(key),
  };

  return notificationProvider;
};
