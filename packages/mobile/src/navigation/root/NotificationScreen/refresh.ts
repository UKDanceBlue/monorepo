import { useCallback, useEffect, useState } from "react";

import { NotificationDeliveryFragment } from "@common/fragments/NotificationScreenGQL";
import { Logger } from "@common/logger/Logger";
import { showMessage } from "@common/util/alertUtils";
import { useDeviceData } from "@context/device";
import { ErrorCode } from "@ukdanceblue/common";
import {
  FragmentType,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { useClient } from "urql";

export const deviceNotificationsQuery = graphql(/* GraphQL */ `
  query DeviceNotifications(
    $deviceUuid: String!
    $page: Int
    $verifier: String!
  ) {
    device(uuid: $deviceUuid) {
      data {
        notificationDeliveries(pageSize: 8, page: $page, verifier: $verifier) {
          ...NotificationDeliveryFragment
        }
      }
    }
  }
`);

export function useLoadNotifications(): {
  refreshNotifications: () => void;
  loadMoreNotifications: () => void;
  notifications:
    | readonly FragmentType<typeof NotificationDeliveryFragment>[]
    | null;
} {
  // Null when loading, an array of notification pages when loaded (2D array)
  const [notificationPages, setNotificationPages] = useState<
    (readonly FragmentType<typeof NotificationDeliveryFragment>[])[] | null
  >(null);

  const { deviceId, verifier } = useDeviceData();

  const client = useClient();

  const [stopLoadingTimeout, setStopLoadingTimeout] =
    useState<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (stopLoadingTimeout) {
        clearTimeout(stopLoadingTimeout);
      }
    };
  }, [stopLoadingTimeout]);

  const loadPage = useCallback(
    (page: number) => {
      if (!deviceId || !verifier) {
        return;
      }

      client
        .query(
          deviceNotificationsQuery,
          {
            deviceUuid: deviceId,
            verifier,
            page,
          },
          { requestPolicy: "network-only" }
        )
        .then((result) => {
          try {
            if (result.error) {
              const code = result.error?.graphQLErrors[0]?.extensions?.code;
              if (code === ErrorCode.Unauthorized) {
                // I don't really want to handle dealing with a device that's forgotten it's verifier...
                // ...so I'm just going to tell the user to report it as a bug and we'll figure it out if it happens
                showMessage(
                  "This is a bug. Please report it using the button in the profile screen.",
                  "Access Denied"
                );
              } else {
                showMessage(
                  "We're having some trouble loading your notifications."
                );
              }
              Logger.error("Failed to load notifications", {
                error: result.error,
              });
              setNotificationPages([]);
            } else {
              Logger.debug(`Loaded notifications page ${page}`);
              setNotificationPages((prev) => {
                if (!result.data) {
                  return prev;
                }
                const existingPages = [...(prev ?? [])];
                existingPages[page - 1] =
                  result.data.device.data.notificationDeliveries;
                return existingPages;
              });
            }
          } finally {
            // Make sure we don't leave the state as null
            setNotificationPages((old) => old ?? []);
          }
        });
    },
    [deviceId, verifier, client]
  );

  const refreshNotifications = useCallback(() => {
    if (deviceId && verifier) {
      Logger.debug("Refreshing notifications");
      loadPage(1);
    }
  }, [deviceId, verifier, loadPage]);

  const loadMoreNotifications = useCallback(() => {
    if (notificationPages) {
      Logger.debug("Loading more notifications", {
        context: { notificationPagesLength: notificationPages.length },
      });
      loadPage(notificationPages.length + 1);
    }
  }, [notificationPages, loadPage]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return {
    refreshNotifications,
    loadMoreNotifications,
    notifications: notificationPages?.flat() ?? null,
  };
}
