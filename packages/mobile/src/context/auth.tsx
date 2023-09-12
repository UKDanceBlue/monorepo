import { createContext, useContext, useEffect, useState } from "react";

import { log, universalCatch } from "../common/logging";

import { useDeviceData } from "./device";
import { useFirebase } from "./firebase";

interface UnloadedAuthData {
  isAuthLoaded: false;
  isLoggedIn: false;
  isAnonymous: false;
  uid: null;
  authClaims: null;
}

interface LoadedAuthData {
  isAuthLoaded: true;
  isLoggedIn: boolean;
  isAnonymous: boolean;
  uid: string | null;
  authClaims: { [key: string]: string | unknown } | null;
}

type AuthData = UnloadedAuthData | LoadedAuthData;

const initialAuthState: AuthData = {
  isAuthLoaded: false,
  isLoggedIn: false,
  isAnonymous: false,
  uid: null,
  authClaims: null,
};

const loggedOutAuthState: AuthData = {
  isAuthLoaded: true,
  isLoggedIn: false,
  isAnonymous: false,
  uid: null,
  authClaims: null,
};

const AuthDataContext = createContext<[AuthData, () => void]>([ initialAuthState, () => undefined ]);

export const AuthDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [ authData, setAuthData ] = useState<AuthData>(initialAuthState);

  const {
    fbAuth, fbAnalytics, fbCrashlytics, fbFirestore
  } = useFirebase();

  const { deviceId } = useDeviceData();

  useEffect(() => {
    const unsubscribe = fbAuth.onAuthStateChanged((user) => {
      (async () => {
        try {
          if (user) {
            const idTokenResult = await user.getIdTokenResult(true);

            setAuthData({
              isAuthLoaded: true,
              isLoggedIn: true,
              isAnonymous: user.isAnonymous,
              uid: user.uid,
              authClaims: idTokenResult.claims,
            });

            await Promise.all(
              [
                fbAnalytics.setUserId(user.uid),
                fbCrashlytics.setUserId(user.uid)
              ]
            )
              .then(() => {
                log("Updated userId for analytics and crashlytics");
              })
              .catch(universalCatch);
          } else {
            setAuthData(loggedOutAuthState);
          }
        } catch (error) {
          universalCatch(error);
          setAuthData(initialAuthState);

          Promise.all(
            [
              fbAnalytics.setUserId(null),
              fbCrashlytics.setUserId("[LOGGED_OUT]")
            ]
          )
            .then(() => {
              log("Updated userId for analytics and crashlytics");
            })
            .catch(universalCatch);
        }

        if (deviceId != null) {
        // Update the user's uid in firestore when auth state changes so long as the uuid has ben initialized
          await fbFirestore
            .doc(`devices/${deviceId}`)
            .set({ latestUserId: user?.uid ?? null }, { merge: true })
            .then(() => {
              log("Updated latestUserId for device in firestore");
            })
            .catch(universalCatch);
        }
      })().catch(universalCatch);
    });

    return unsubscribe;
  }, [
    deviceId, fbAnalytics, fbAuth, fbCrashlytics, fbFirestore
  ]);

  const setDemoMode = () => {
    setAuthData({
      ...initialAuthState,
      isAuthLoaded: true,
      isLoggedIn: true,
      uid: "demo"
    });
  };

  return (
    <AuthDataContext.Provider value={[ authData, setDemoMode ]}>
      {children}
    </AuthDataContext.Provider>
  );
};

export const useAuthData = () => {
  return useContext(AuthDataContext)[0];
};

export const useEnterDemoMode = () => {
  return useContext(AuthDataContext)[1];
};
