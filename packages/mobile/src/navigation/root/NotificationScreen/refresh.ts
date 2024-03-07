import type { NotificationDeliveryFragment } from "@common/fragments/NotificationScreenGQL";
import { Logger } from "@common/logger/Logger";
import { showMessage } from "@common/util/alertUtils";
import { useDeviceData } from "@context/device";
import { ErrorCode } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useClient } from "urql";

const NOTIFICATION_PAGE_SIZE = 2;
const INCOMPLETE_PAGE_TIMEOUT = 10_000;

export const deviceNotificationsQuery = graphql(/* GraphQL */ `
  query DeviceNotifications(
    $deviceUuid: String!
    $page: Int
    $pageSize: Int
    $verifier: String!
  ) {
    device(uuid: $deviceUuid) {
      data {
        notificationDeliveries(
          pageSize: $pageSize
          page: $page
          verifier: $verifier
        ) {
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

  const [foundIncompletePageAt, setFoundIncompletePageAt] =
    useState<DateTime>();

  const loadPage = useCallback(
    (page: number) => {
      if (!deviceId || !verifier) {
        Logger.debug(
          "Not loading notifications, missing either the device ID or verifier"
        );
        return;
      }
      if (foundIncompletePageAt) {
        if (
          foundIncompletePageAt
            .plus({ milliseconds: INCOMPLETE_PAGE_TIMEOUT })
            .diffNow().milliseconds > 0
        ) {
          Logger.debug(
            "Not loading notifications for now, we found the end of the list already"
          );
          return;
        } else {
          setFoundIncompletePageAt(undefined);
        }
      }

      Logger.debug(`Loading notifications page ${page}`);

      void client
        .query(
          deviceNotificationsQuery,
          {
            deviceUuid: deviceId,
            verifier,
            page,
            pageSize: NOTIFICATION_PAGE_SIZE,
          },
          { requestPolicy: "network-only" }
        )
        .then((result) => {
          try {
            if (result.error) {
              const code = result.error.graphQLErrors[0]?.extensions?.code;
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

                if (existingPages[page - 1].length < NOTIFICATION_PAGE_SIZE) {
                  Logger.debug(
                    `Loaded incomplete page ${page}, stopping loading for ${INCOMPLETE_PAGE_TIMEOUT}ms`
                  );
                  setFoundIncompletePageAt(DateTime.now());
                }

                return existingPages;
              });
            }
          } finally {
            // Make sure we don't leave the state as null
            setNotificationPages((old) => old ?? []);
          }
        });
    },
    [client, deviceId, verifier, foundIncompletePageAt]
  );

  const refreshNotifications = useCallback(() => {
    loadPage(1);
  }, [loadPage]);

  const loadMoreNotifications = useCallback(() => {
    if (notificationPages) {
      // Should we load a new page or an old one?
      let reloadAll = false;
      let lastCompletePage = 0;
      for (let i = 0; i < notificationPages.length; i++) {
        // If we have a page that's longer than the page size, we need to reload all as that's an invariant violation
        if (notificationPages[i].length > NOTIFICATION_PAGE_SIZE) {
          reloadAll = true;
          break;
        } else if (notificationPages[i].length === NOTIFICATION_PAGE_SIZE) {
          lastCompletePage = i;
        }
      }
      if (reloadAll) {
        Logger.debug("Reloading all notifications");
        refreshNotifications();
      } else {
        loadPage(lastCompletePage + 2);
      }
    }
  }, [notificationPages, loadPage, refreshNotifications]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  return {
    refreshNotifications,
    loadMoreNotifications,
    notifications: notificationPages?.flat() ?? null,
  };
}
