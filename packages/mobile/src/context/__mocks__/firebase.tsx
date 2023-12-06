import type { FirebaseAnalyticsTypes } from "@react-native-firebase/analytics";
import analytics from "@react-native-firebase/analytics";
import type { FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics";
import crashlytics from "@react-native-firebase/crashlytics";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import type { FirebaseRemoteConfigTypes } from "@react-native-firebase/remote-config";
import remoteConfig from "@react-native-firebase/remote-config";
import type { FirebaseStorageTypes } from "@react-native-firebase/storage";
import storage from "@react-native-firebase/storage";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

jest.mock("@react-native-firebase/analytics", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
jest.mock("@react-native-firebase/crashlytics", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
jest.mock("@react-native-firebase/firestore", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
jest.mock("@react-native-firebase/remote-config", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
jest.mock("@react-native-firebase/storage", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

export const FirebaseContext = createContext<{
  fbAnalytics: FirebaseAnalyticsTypes.Module;
  fbCrashlytics: FirebaseCrashlyticsTypes.Module;
  fbFirestore: FirebaseFirestoreTypes.Module;
  fbRemoteConfig: FirebaseRemoteConfigTypes.Module;
  fbStorage: FirebaseStorageTypes.Module;
}>({} as never);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    fbAnalytics: analytics(),
    fbCrashlytics: crashlytics(),
    fbFirestore: firestore(),
    fbRemoteConfig: remoteConfig(),
    fbStorage: storage(),
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase() {
  return useContext(FirebaseContext);
}
