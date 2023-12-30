import type { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import type {
  FirestoreNotification,
  FirestoreTeam,
} from "@ukdanceblue/db-app-common";

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

/** @deprecated */
export const useUserData = (): UserData => ({
  attributes: {},
  email: null,
  firstName: null,
  lastName: null,
  notificationReferences: [],
  team: null,
  teamId: null as string | null,
  userLoginType: null,
});

/** @deprecated */
export const useRefreshUserData = () => {
  return () => Promise.resolve();
};
