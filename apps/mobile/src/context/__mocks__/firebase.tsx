import analytics, { FirebaseAnalyticsTypes } from "@react-native-firebase/analytics";
import appCheck, { FirebaseAppCheckTypes } from "@react-native-firebase/app-check";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import crashlytics, { FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import functions, { FirebaseFunctionsTypes } from "@react-native-firebase/functions";
import remoteConfig, { FirebaseRemoteConfigTypes } from "@react-native-firebase/remote-config";
import storage, { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { ReactNode, createContext, useContext, useEffect } from "react";

jest.mock("@react-native-firebase/analytics", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
jest.mock("@react-native-firebase/app-check", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
jest.mock("@react-native-firebase/auth", () => {
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
jest.mock("@react-native-firebase/functions", () => {
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

import { universalCatch } from "../../common/logging";

export const FirebaseContext = createContext<{
  fbAnalytics: FirebaseAnalyticsTypes.Module;
  fbAppCheck: FirebaseAppCheckTypes.Module;
  fbAuth: FirebaseAuthTypes.Module;
  fbCrashlytics: FirebaseCrashlyticsTypes.Module;
  fbFirestore: FirebaseFirestoreTypes.Module;
  fbFunctions: FirebaseFunctionsTypes.Module;
  fbRemoteConfig: FirebaseRemoteConfigTypes.Module;
  fbStorage: FirebaseStorageTypes.Module;
}>({} as never);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    fbAnalytics: analytics(),
    fbAppCheck: appCheck(),
    fbAuth: auth(),
    fbCrashlytics: crashlytics(),
    fbFirestore: firestore(),
    fbFunctions: functions(),
    fbRemoteConfig: remoteConfig(),
    fbStorage: storage(),
  };

  useEffect(() => {
    value.fbAppCheck.activate("THIS STRING SHOULD BE IGNORED, IF IT IS NOT, THEN SOMETHING HAS CHANGED IN THE LIBRARY").catch(universalCatch);
  }, [value.fbAppCheck]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase() {
  return useContext(FirebaseContext);
}
