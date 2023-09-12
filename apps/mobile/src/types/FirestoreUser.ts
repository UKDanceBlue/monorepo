import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreNotification } from "@ukdanceblue/db-app-common";

import { isDocumentReference } from "./firebaseTypes";

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface FirestoreUser {
  attributes: Record<string, string>;
  email: string;
  firstName: string;
  lastName: string;
  linkblue?: string | null;
  team?: FirebaseFirestoreTypes.DocumentReference | null;
  notificationReferences?: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification>[] | null;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export function isFirestoreUser(documentData?: FirebaseFirestoreTypes.DocumentData): documentData is FirestoreUser {
  if (documentData == null) {
    return false;
  }

  // Check that all required fields are present
  if (documentData.attributes == null) {
    documentData.attributes = {};
  }
  if (documentData.email == null) {
    return false;
  }
  if (documentData.firstName == null) {
    return false;
  }
  if (documentData.lastName == null) {
    return false;
  }

  if (typeof documentData.attributes !== "object") {
    return false;
  }
  if (typeof documentData.email !== "string") {
    return false;
  }
  if (typeof documentData.firstName !== "string") {
    return false;
  }
  if (typeof documentData.lastName !== "string") {
    return false;
  }

  if (documentData.linkblue != null && typeof documentData.linkblue !== "string") {
    return false;
  }
  if (documentData.team != null && !(isDocumentReference(documentData.team))) {
    return false;
  }
  return !(documentData.pastNotifications != null && (!Array.isArray(documentData.pastNotifications) || documentData.pastNotifications.some((x) => !(isDocumentReference(x)))));
}
