import type { FirebaseAnalyticsTypes } from "@react-native-firebase/analytics";
import analytics from "@react-native-firebase/analytics";
import type { FirebaseAppCheckTypes } from "@react-native-firebase/app-check";
import appCheck from "@react-native-firebase/app-check";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import auth from "@react-native-firebase/auth";
import type { FirebaseCrashlyticsTypes } from "@react-native-firebase/crashlytics";
import crashlytics from "@react-native-firebase/crashlytics";
import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import type { FirebaseFunctionsTypes } from "@react-native-firebase/functions";
import functions from "@react-native-firebase/functions";
import type { FirebaseRemoteConfigTypes } from "@react-native-firebase/remote-config";
import remoteConfig from "@react-native-firebase/remote-config";
import type { FirebaseStorageTypes } from "@react-native-firebase/storage";
import storage from "@react-native-firebase/storage";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";

import { universalCatch } from "../common/logging";

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
    value.fbAppCheck
      .activate(
        "THIS STRING SHOULD BE IGNORED, IF IT IS NOT, THEN SOMETHING HAS CHANGED IN THE LIBRARY"
      )
      .catch(universalCatch);
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
