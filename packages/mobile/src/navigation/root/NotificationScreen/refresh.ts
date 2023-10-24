import { log, universalCatch } from "@common/logging";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { FirestoreNotification } from "@ukdanceblue/db-app-common";
import { isFirestoreNotification } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import type { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import type { NotificationListDataEntry } from "./NotificationScreen";

export async function refreshNotificationScreen(
  notificationReferences: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification>[],
  setNotifications: Dispatch<
    SetStateAction<(NotificationListDataEntry | undefined)[]>
  >,
  indexWithOpenMenu: SharedValue<number | undefined>
) {
  // Get the notifications from references
  const promises: Promise<NotificationListDataEntry | undefined>[] = [];

  let hasAlerted = false as boolean;

  for (const pastNotificationRef of notificationReferences) {
    promises.push(
      (async () => {
        let pastNotificationSnapshot:
          | FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification>
          | undefined = undefined;
        try {
          pastNotificationSnapshot = await pastNotificationRef.get({
            source: "server",
          });
        } catch (_) {
          try {
            pastNotificationSnapshot = await pastNotificationRef.get();
          } catch (error) {
            universalCatch(error);

            if (!hasAlerted) {
              Alert.alert(
                "Error",
                "There was an error loading some of your notifications. Please try again."
              );
              hasAlerted = true;
            }
          }
        }

        if (pastNotificationSnapshot == null) {
          return undefined;
        }

        const pastNotificationSnapshotData = pastNotificationSnapshot.data();
        if (isFirestoreNotification(pastNotificationSnapshotData)) {
          return {
            notification: pastNotificationSnapshotData,
            indexWithOpenMenu,
            reference: pastNotificationSnapshot.ref,
          };
        } else {
          log(
            `Past notification: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> "${pastNotificationSnapshot.ref.path}" is not valid`,
            "warn"
          );
          return undefined;
        }
      })()
    );
  }

  const resolvedPromises = await Promise.all(promises);
  const notificationsByDate = resolvedPromises
    .filter(
      (notification): notification is NotificationListDataEntry =>
        notification !== undefined
    )
    .sort(
      (a, b) =>
        (b.notification?.sendTime == null
          ? 0
          : DateTime.fromISO(b.notification.sendTime).toMillis()) -
        (a.notification?.sendTime == null
          ? 0
          : DateTime.fromISO(a.notification.sendTime).toMillis())
    );
  setNotifications(notificationsByDate);
}
