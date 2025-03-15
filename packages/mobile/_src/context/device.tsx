import { setTag as setSentryTag } from "@sentry/react-native";
import { arrayToBase64String } from "@ukdanceblue/common";
import {
  CryptoDigestAlgorithm,
  CryptoEncoding,
  digestStringAsync,
  getRandomBytesAsync,
  randomUUID,
} from "expo-crypto";
import { isDevice, osName } from "expo-device";
import type { PermissionStatus } from "expo-notifications";
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  IosAuthorizationStatus,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from "expo-notifications";
import {
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  getItemAsync,
  setItemAsync,
} from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "urql";

import { useNetworkStatus } from "@/common/customHooks";
import { Logger } from "@/common/logger/Logger";
import { graphql } from "@/graphql/index";

import { universalCatch } from "../common/logging";
import { useAuthState } from "./auth";
import { useLoading } from "./useLoading";

const setDeviceQuery = graphql(/* GraphQL */ `
  mutation SetDevice($input: RegisterDeviceInput!) {
    registerDevice(input: $input) {
      ok
    }
  }
`);

const uuidStoreKey = __DEV__
  ? "danceblue.device-uuid.dev"
  : "danceblue.device-uuid";
const verifierStoreKey = __DEV__
  ? "danceblue.device-verifier.dev"
  : "danceblue.device-verifier";

interface DeviceData {
  deviceId: string | null;
  verifier: string | null;
  pushToken: string | null;
  getsNotifications: boolean;
}

const initialDeviceDataState: DeviceData = {
  deviceId: null,
  verifier: null,
  pushToken: null,
  getsNotifications: false,
};

async function obtainUuid() {
  // Get UUID from async storage
  let uuid = await getItemAsync(uuidStoreKey, {
    keychainAccessible: AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });

  // If nothing was in async storage, generate a new uuid and store it
  if (uuid) {
    return uuid;
  }

  uuid = randomUUID();

  await setItemAsync(uuidStoreKey, uuid, {
    keychainAccessible: AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
  return uuid;
}

async function obtainVerifier(uuid: string): Promise<string> {
  // Get verifier from async storage
  let verifierString = await getItemAsync(verifierStoreKey, {
    keychainAccessible: AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });

  if (!verifierString) {
    const randomString = arrayToBase64String(await getRandomBytesAsync(32));
    verifierString = `${uuid}:${randomString}`;
  }

  return digestStringAsync(CryptoDigestAlgorithm.SHA512, verifierString, {
    encoding: CryptoEncoding.BASE64,
  });
}

async function registerPushNotifications() {
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

      return {
        token: await getExpoPushTokenAsync({
          projectId: "86042d7a-cd35-415c-87ed-f53c008b3827",
        }),
        notificationPermissionsGranted: true,
      };
    } else {
      return { token: null, notificationPermissionsGranted: false };
    }
  } else {
    // TODO: This is a dumb way to pass back the device being an emulator, use an enum or something in a return type
    throw new Error("DEVICE_IS_EMULATOR");
  }
}

const DeviceDataContext = createContext<DeviceData>(initialDeviceDataState);

export const DeviceDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [, setLoading] = useLoading(undefined, 10_000);

  const [{ isConnected }, isNetStatusLoaded] = useNetworkStatus();

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [verifier, setVerifier] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [getsNotifications, setGetsNotifications] = useState<boolean>(false);

  const { ready, personUuid } = useAuthState();

  const [, setDevice] = useMutation(setDeviceQuery);

  useEffect(() => {
    if (!isNetStatusLoaded || !isConnected) {
      return;
    }
    if (!ready) {
      return;
    }
    setLoading(true);

    obtainUuid()
      .then(async (uuid) => ({ uuid, verifier: await obtainVerifier(uuid) }))
      .then(async ({ uuid, verifier }) => {
        setDeviceId(uuid);
        setVerifier(verifier);
        setSentryTag("device-id", uuid);
        try {
          const { token, notificationPermissionsGranted } =
            await registerPushNotifications();

          const { error } = await setDevice({
            input: {
              deviceId: uuid,
              expoPushToken: token?.data ?? null,
              lastUserId: personUuid,
              verifier,
            },
          });
          if (error && (error.graphQLErrors.length > 0 || error.networkError)) {
            Logger.error("Error registering push notifications", { error });
          } else {
            setPushToken(token?.data ?? null);
            setGetsNotifications(notificationPermissionsGranted);
          }
        } catch (error) {
          if ((error as Error | undefined)?.message === "DEVICE_IS_EMULATOR") {
            setPushToken(null);
            setGetsNotifications(false);

            Logger.warn("Notifications are not supported on emulators.");
          } else {
            Logger.error("Error registering push notifications", { error });
          }
        }

        Logger.info("Device registered", {
          context: { deviceId: uuid },
        });
      })
      .catch(universalCatch)
      .finally(() => setLoading(false));
  }, [
    ready,
    setDevice,
    setLoading,
    personUuid,
    isNetStatusLoaded,
    isConnected,
  ]);

  return (
    <DeviceDataContext.Provider
      value={{ deviceId, verifier, pushToken, getsNotifications }}
    >
      {children}
    </DeviceDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDeviceData = () => useContext(DeviceDataContext);
