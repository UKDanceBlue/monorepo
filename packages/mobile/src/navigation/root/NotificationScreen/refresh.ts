import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreNotification, isFirestoreNotification } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import { SharedValue } from "react-native-reanimated";

import { log, universalCatch } from "../../../common/logging";

import { NotificationListDataEntry } from "./NotificationScreen";

export async function refreshNotificationScreen(
  notificationReferences: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification>[],
  setNotifications: Dispatch<SetStateAction<(NotificationListDataEntry | undefined)[]>>,
  indexWithOpenMenu: SharedValue<number | undefined>) {
  // Get the notifications from references
  const promises: Promise<NotificationListDataEntry | undefined>[] = [];

  let hasAlerted = false;

  for (const pastNotificationRef of notificationReferences) {
    promises.push((async () => {
      let pastNotificationSnapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> | undefined = undefined;
      try {
        pastNotificationSnapshot = await pastNotificationRef.get({ source: "server" });
      } catch (_) {
        try {
          pastNotificationSnapshot = await pastNotificationRef.get();
        } catch (e) {
          universalCatch(e);
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (!hasAlerted) {
            Alert.alert("Error", "There was an error loading some of your notifications. Please try again.");
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
          reference: pastNotificationSnapshot.ref
        };
      } else {
        log(`Past notification: FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification> "${pastNotificationSnapshot.ref.path}" is not valid`, "warn");
        return undefined;
      }
    })());
  }

  const resolvedPromises = await Promise.all(promises);
  const notificationsByDate = resolvedPromises
    .filter((notification): notification is NotificationListDataEntry => notification !== undefined)
    .sort((a, b) => (
      b.notification?.sendTime == null
        ? 0
        : DateTime.fromISO(b.notification.sendTime).toMillis()
    ) -
        (a.notification?.sendTime == null
          ? 0
          : DateTime.fromISO(a.notification.sendTime).toMillis()
        )
    );
  setNotifications(notificationsByDate);
}
