import type { NotificationProvider } from "@refinedev/core";
import { App } from "antd";

import { UndoableNotification } from "./UndoableNotification";

export const useNotificationProvider = (): NotificationProvider => {
  const app = App.useApp();

  console.log(app);

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
        app.notification.open({
          key,
          description: (
            <UndoableNotification
              notificationKey={key}
              message={message}
              cancelMutation={() => {
                cancelMutation?.();
                app.notification.destroy(key ?? "");
              }}
              undoableTimeout={undoableTimeout}
            />
          ),
          message: null,
          duration: 0,
          closeIcon: <></>,
        });
      } else {
        app.notification.open({
          key,
          description: message,
          message: description ?? null,
          type,
          duration: type === "error" ? 0 : undefined,
        });
      }
    },
    close: (key) => app.notification.destroy(key),
  };

  return notificationProvider;
};
