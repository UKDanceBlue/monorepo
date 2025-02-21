import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";
import { useClient } from "urql";

import { NotificationDeliveryFragment } from "@/common/fragments/NotificationScreenGQL";
import { useAsyncStorage } from "@/common/hooks/useAsyncStorage";
import { Logger } from "@/common/logger/Logger";
import { showMessage } from "@/common/util/alertUtils";
import { useDeviceData } from "@/context/device";
import type { FragmentOf } from "@/graphql/index";
import { graphql } from "@/graphql/index";

const NOTIFICATION_PAGE_SIZE = 8;
const INCOMPLETE_PAGE_TIMEOUT = 10_000;

const deviceNotificationsQuery = graphql(
  /* GraphQL */ `
    query DeviceNotifications(
      $deviceUuid: String!
      $page: PositiveInt
      $pageSize: NonNegativeInt
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
  `,
  [NotificationDeliveryFragment]
);

export function useLoadNotifications(): {
  refreshNotifications: (force?: boolean) => void;
  loadMoreNotifications: () => void;
  notifications:
    | readonly FragmentOf<typeof NotificationDeliveryFragment>[]
    | null;
  loading: boolean;
} {
  // Null when loading, an array of notification pages when loaded (2D array)
  const [notificationPages, setNotificationPages] = useState<
    (readonly FragmentOf<typeof NotificationDeliveryFragment>[])[] | null
  >([]);
  const [, setHasWarnedAboutNoNotifications] = useState(false);
  const [loadingNotification, setLoadingNotification] = useState(false);

  const { getItem, setItem } = useAsyncStorage("notification-cache");

  useEffect(() => {
    (async () => {
      const cached = await getItem();
      if (cached) {
        Logger.debug("Loaded cached notifications");
        setNotificationPages((notificationPages) =>
          notificationPages?.length === 0
            ? (JSON.parse(cached) as (readonly FragmentOf<
                typeof NotificationDeliveryFragment
              >[])[])
            : notificationPages
        );
      }
    })().catch((error: unknown) => {
      Logger.error("Failed to load cached notifications", { error });
    });
  }, [getItem]);

  const { deviceId, verifier } = useDeviceData();

  const client = useClient();

  const [foundIncompletePageAt, setFoundIncompletePageAt] =
    useState<DateTime>();

  const loadPage = useCallback(
    (page: number, force?: boolean) => {
      if (!deviceId || !verifier) {
        Logger.debug(
          "Not loading notifications, missing either the device ID or verifier"
        );
        return;
      }
      if (foundIncompletePageAt && !force) {
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

      setLoadingNotification(true);
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
              if (code === "Unauthenticated") {
                // I don't really want to handle dealing with a device that's forgotten it's verifier...
                // ...so I'm just going to tell the user to report it as a bug and we'll figure it out if it happens
                showMessage(
                  "This is a bug. Please report it using the button in the profile screen.",
                  "Access Denied"
                );
              } else {
                setHasWarnedAboutNoNotifications((existing) => {
                  if (!existing) {
                    showMessage(
                      "We're having some trouble loading your latest notifications."
                    );
                  }
                  return true;
                });
              }
              Logger.error("Failed to load notifications", {
                error: result.error,
              });
            } else {
              Logger.debug(`Loaded notifications page ${page}`);
              setNotificationPages((prev) => {
                if (!result.data) {
                  return prev;
                }
                const newPages = [...(prev ?? [])];
                newPages[page - 1] =
                  result.data.device.data.notificationDeliveries;

                if (newPages[page - 1].length < NOTIFICATION_PAGE_SIZE) {
                  Logger.debug(
                    `Loaded incomplete page ${page}, stopping loading for ${INCOMPLETE_PAGE_TIMEOUT}ms`
                  );
                  setFoundIncompletePageAt(DateTime.now());
                }

                void setItem(JSON.stringify(newPages)).catch(
                  (error: unknown) => {
                    Logger.error("Failed to save notifications to cache", {
                      error,
                    });
                  }
                );

                return newPages;
              });
            }
          } finally {
            setLoadingNotification(false);
          }
        });
    },
    [
      deviceId,
      verifier,
      foundIncompletePageAt,
      setLoadingNotification,
      client,
      setItem,
    ]
  );

  const refreshNotifications = useCallback(
    (force?: boolean) => {
      loadPage(1, force);
    },
    [loadPage]
  );

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
    loading: loadingNotification,
  };
}
