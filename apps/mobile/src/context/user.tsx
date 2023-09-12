import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreNotification } from "@ukdanceblue/db-app-common";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { log, universalCatch } from "../common/logging";
import { FirestoreTeam, isFirestoreTeam } from "../types/FirestoreTeam";
import { isFirestoreUser } from "../types/FirestoreUser";

import { useAuthData } from "./auth";
import { useFirebase } from "./firebase";
import { useLoading } from "./loading";

export type UserLoginType = "anonymous" | "ms-oath-linkblue";
interface UserData {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  linkblue?: string | null;
  attributes: Record<string, string>;
  team: FirestoreTeam | null;
  teamId: string | null;
  userLoginType: UserLoginType | null;
  notificationReferences: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification>[];
}
const initialUserDataState: UserData = {
  firstName: null,
  lastName: null,
  email: null,
  linkblue: null,
  attributes: {},
  team: null,
  teamId: null,
  userLoginType: null,
  notificationReferences: [],
};

const loadUserData = async (userId: string, loginType: UserLoginType, firestore: FirebaseFirestoreTypes.Module): Promise<UserData> => {
  const loadedUserData: UserData = { ...initialUserDataState, userLoginType: loginType };

  switch (loginType) {
  case "anonymous": {
    break;
  }
  case "ms-oath-linkblue": {
    // Get the user's base document
    const userDataDoc = firestore.collection("users").doc(userId);
    const userDataSnapshot = await userDataDoc.get();

    if (!userDataSnapshot.exists) {
      throw new Error("User data not found");
    }

    const rawUserData = userDataSnapshot.data();

    if (!isFirestoreUser(rawUserData)) {
      throw new Error("User data is not valid");
    }
    // Check for a user's own data
    loadedUserData.firstName = rawUserData.firstName;
    loadedUserData.lastName = rawUserData.lastName;
    loadedUserData.email = rawUserData.email;
    loadedUserData.attributes = rawUserData.attributes;
    if (rawUserData.linkblue != null) {
      loadedUserData.linkblue = rawUserData.linkblue;
    }
    loadedUserData.notificationReferences = rawUserData.notificationReferences ?? [];

    // Check for a user's team data
    if (rawUserData.team?.id != null) {
      const userTeamSnapshot = await rawUserData.team.get();

      if (userTeamSnapshot.exists) {
        const userTeamSnapshotData = userTeamSnapshot.data();
        if (isFirestoreTeam(userTeamSnapshotData)) {
          loadedUserData.team = userTeamSnapshotData;
          loadedUserData.teamId = rawUserData.team.id;
        } else {
          log(`Team "${userTeamSnapshot.ref.path}" is not valid`, "warn");
        }
      }
    }
    break;
  }
  default: {
    throw new Error("Invalid login type");
  }
  }

  return loadedUserData;
};

const UserDataContext = createContext<[UserData, (() => Promise<void>)]>([ initialUserDataState, async () => Promise.resolve() ]);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [ , setLoading ] = useLoading("UserDataProvider");

  const [ userData, setUserData ] = useState<UserData>(initialUserDataState);

  const {
    isLoggedIn, uid, isAnonymous, isAuthLoaded
  } = useAuthData();

  const { fbFirestore } = useFirebase();

  const refresh = useCallback(() => {
    if (isAuthLoaded && isLoggedIn && uid != null) {
      setLoading(true);
      return loadUserData(uid, isAnonymous ? "anonymous" : "ms-oath-linkblue", fbFirestore)
        .then(setUserData)
        .finally(() => setLoading(false));
    } else {
      setUserData(initialUserDataState);

      return Promise.resolve();
    }
  }, [
    fbFirestore, isAnonymous, isAuthLoaded, isLoggedIn, uid, setLoading
  ]);

  useEffect(() => {
    refresh().catch(universalCatch);
  }, [refresh]);

  return (
    <UserDataContext.Provider value={[ userData, refresh ]}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserData => useContext(UserDataContext)[0];
export const useRefreshUserData = () => useContext(UserDataContext)[1];
