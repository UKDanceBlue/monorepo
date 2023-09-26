import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type { FirestoreNotification } from "@ukdanceblue/common";
// import { getInstallationTimeAsync } from "expo-application";
import { universalCatch } from "@ukdanceblue/common/logging";
import { useEffect, useMemo, useState } from "react";
import type { SharedValue } from "react-native-reanimated";

import { useFirebase } from "../../../context";

import type { NotificationListDataEntry } from "./NotificationScreen";

export const useFallBackNotificationLoader = (
  enable: boolean,
  indexWithOpenMenu: SharedValue<number | undefined>
): [NotificationListDataEntry[] | null, () => Promise<void>] => {
  const [notifications, setNotifications] = useState<
    FirebaseFirestoreTypes.DocumentSnapshot<FirestoreNotification>[] | null
  >(null);
  const { fbFirestore } = useFirebase();

  const getNotifications = useMemo(async () => {
    if (enable) {
      // const installationTime = await getInstallationTimeAsync(); // TODO - use this to filter out notifications that are too old once the cloud function is updated
      return (
        (
          (await fbFirestore
            .collection("past-notifications")
            .orderBy("sendTime", "desc")
            // .where("sendTime", ">=", installationTime)
            .where("sentToAll", "==", true)
            .get()) as FirebaseFirestoreTypes.QuerySnapshot<FirestoreNotification>
        ).docs.map((doc) => {
          // console.log(doc.data());
          return doc;
        })
      );
    } else {
      return null;
    }
  }, [enable, fbFirestore]);

  useEffect(() => {
    getNotifications.then(setNotifications).catch(universalCatch);
  }, [getNotifications]);

  return [
    notifications?.map((doc) => ({
      notification: doc.data(),
      indexWithOpenMenu,
      reference: doc.ref,
    })) ?? null,
    () => getNotifications.then(setNotifications).catch(universalCatch),
  ];
};
