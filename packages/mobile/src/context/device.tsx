import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { isDevice, osName } from "expo-device";
import type { PermissionStatus } from "expo-notifications";
import {
  AndroidImportance,
  IosAuthorizationStatus,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from "expo-notifications";
import {
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  getItemAsync,
  setItemAsync,
} from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 } from "uuid";

import { universalCatch } from "../common/logging";
import { showMessage } from "../common/util/alertUtils";

import { useFirebase } from "./firebase";
import { useLoading } from "./loading";

const uuidStoreKey = __DEV__
  ? "danceblue.device-uuid.dev"
  : "danceblue.device-uuid";

interface DeviceData {
  deviceId: string | null;
  pushToken: string | null;
  getsNotifications: boolean;
}

const initialDeviceDataState: DeviceData = {
  deviceId: null,
  pushToken: null,
  getsNotifications: false,
};

const obtainUuid = async () => {
  // Get UUID from async storage
  let uuid = await getItemAsync(uuidStoreKey, {
    keychainAccessible: AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });

  // If nothing was in async storage, generate a new uuid and store it
  if (uuid) {
    return uuid;
  }

  uuid = v4();

  await setItemAsync(uuidStoreKey, uuid, {
    keychainAccessible: AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
  return uuid;
};

const registerPushNotifications = async (
  firestore: FirebaseFirestoreTypes.Module,
  uuid?: string
) => {
  if (isDevice) {
    // Get the user's current preference
    let settings = await getPermissionsAsync();

    // If the user hasn't set a preference yet, ask them.
    if (
      settings.status === ("undetermined" as PermissionStatus.UNDETERMINED) ||
      settings.ios?.status === IosAuthorizationStatus.NOT_DETERMINED
    ) {
      settings = await requestPermissionsAsync({
        android: {},
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: false,
          allowCriticalAlerts: true,
          provideAppNotificationSettings: false,
          allowProvisional: false,
          allowAnnouncements: false,
        },
      });
    }

    // The user allows notifications, return the push token
    if (
      settings.granted ||
      settings.ios?.status === IosAuthorizationStatus.PROVISIONAL ||
      settings.ios?.status === IosAuthorizationStatus.AUTHORIZED
    ) {
      if (osName === "Android") {
        setNotificationChannelAsync("default", {
          name: "default",
          importance: AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        }).catch(universalCatch);
      }

      return getExpoPushTokenAsync({
        projectId: "86042d7a-cd35-415c-87ed-f53c008b3827",
      }).then(async (token) => {
        if (uuid) {
          // Store the push notification token in firebase
          await firestore
            .doc(`devices/${uuid}`)
            .set({ expoPushToken: token.data || null }, { merge: true });
        }
        return { token, notificationPermissionsGranted: true };
      });
    } else {
      return { token: null, notificationPermissionsGranted: false };
    }
  } else {
    throw new Error("DEVICE_IS_EMULATOR");
  }
};

const DeviceDataContext = createContext<DeviceData>(initialDeviceDataState);

export const DeviceDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [, setLoading] = useLoading();

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [getsNotifications, setGetsNotifications] = useState<boolean>(false);

  const { fbFirestore } = useFirebase();

  useEffect(() => {
    setLoading(true);

    obtainUuid()
      .then(async (uuid) => {
        setDeviceId(uuid);
        try {
          const { token, notificationPermissionsGranted } =
            await registerPushNotifications(fbFirestore, uuid);
          setPushToken(token?.data ?? null);
          setGetsNotifications(notificationPermissionsGranted);
        } catch (error) {
          if ((error as Error | undefined)?.message === "DEVICE_IS_EMULATOR") {
            setPushToken(null);
            setGetsNotifications(false);

            showMessage("Notifications are not supported on emulators.");
          } else {
            universalCatch(error);
          }
        }
      })
      .catch(universalCatch)
      .finally(() => setLoading(false));
  }, [fbFirestore, setLoading]);

  return (
    <DeviceDataContext.Provider
      value={{ deviceId, pushToken, getsNotifications }}
    >
      {children}
    </DeviceDataContext.Provider>
  );
};

export const useDeviceData = () => useContext(DeviceDataContext);
