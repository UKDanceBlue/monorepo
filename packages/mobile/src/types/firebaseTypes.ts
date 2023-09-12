import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirebaseStorageTypes } from "@react-native-firebase/storage";

import { HourInstructionsType, SpecialComponentType } from "./hourScreenTypes";

export type NativeFirebaseError = Parameters<FirebaseStorageTypes.TaskSnapshotObserver["error"]>[0];
export function isFirebaseError(error: unknown): error is NativeFirebaseError {
  if (typeof error !== "object" || error == null) {
    return false;
  }
  if (typeof (error as NativeFirebaseError).code !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).message !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).name !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).namespace !== "string") {
    return false;
  }
  if (typeof (error as NativeFirebaseError).stack !== "string" && (error as NativeFirebaseError).stack != null) {
    return false;
  }
  return !(typeof (error as NativeFirebaseError).cause !== "string" && (error as NativeFirebaseError).cause != null);
}

export interface FirestoreHour {
  hourNumber: number;
  name: string;
  description?: string;
  contentOrder: (
    | "text-instructions"
    | "gs-image"
    | "http-image"
    | "button"
    | "special"
    | "text-block"
    | "photo-upload"
    | "dad-joke-leaderboard"
  )[];
  textInstructions?: HourInstructionsType; // Text-instructions
  firebaseImageUri?: string | string[]; // Gs-image
  imageUri?: string | string[]; // Http-image
  buttonConfig?: { text: string; url: string } | { text: string; url: string }[]; // Button
  specialComponent?: SpecialComponentType | SpecialComponentType[]; // Special
  textBlock?: string | string[];
}

export interface FirestoreMoraleTeam {
  members: Record<string, string>;
  leaders: string;
  teamNumber: number;
  points: number;
}

export const isCollectionReference = (firestoreReference?: unknown): firestoreReference is FirebaseFirestoreTypes.CollectionReference => {
  if (typeof firestoreReference !== "object" || firestoreReference == null) {
    return false;
  }
  if (typeof (firestoreReference as FirebaseFirestoreTypes.CollectionReference).id !== "string") {
    return false;
  }
  return typeof (firestoreReference as FirebaseFirestoreTypes.CollectionReference).path === "string";
};

export const isDocumentReference = (firestoreReference?: unknown): firestoreReference is FirebaseFirestoreTypes.DocumentReference => {
  if (typeof firestoreReference !== "object" || firestoreReference == null) {
    return false;
  }
  if (typeof (firestoreReference as FirebaseFirestoreTypes.DocumentReference).id !== "string") {
    return false;
  }
  if (typeof (firestoreReference as FirebaseFirestoreTypes.DocumentReference).path !== "string") {
    return false;
  }
  return typeof (firestoreReference as FirebaseFirestoreTypes.DocumentReference).parent === "object";
};
