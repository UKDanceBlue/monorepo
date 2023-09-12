/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface FirestoreDevice {
  audiences?: string[] | null;
  expoPushToken?: string | null;
  latestUserId?: string | null;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export function isFirestoreDevice(documentData?: object): documentData is FirestoreDevice {
  // If documentData is nullish, return false
  if (documentData == null) {
    return false;
  }

  // If audience is defined, check it's type
  const { audiences } = documentData as FirestoreDevice;
  if (audiences != null) {
    // If it's not an array, return false
    if (!Array.isArray(audiences)) {
      return false;
    }

    // If it's an array, check that all elements are strings, if not return false
    if (audiences.some((x) => typeof x !== "string")) {
      return false;
    }
  }

  // If expoPushToken is defined, check that it's a string, if not return false
  const { expoPushToken } = documentData as FirestoreDevice;
  if (expoPushToken != null && typeof expoPushToken !== "string") {
    return false;
  }

  // If latestUserId is defined, check that it's a string, if not return false
  const { latestUserId } = documentData as FirestoreDevice;
  if (latestUserId != null && typeof latestUserId !== "string") {
    return false;
  }

  // If all checks pass, return true
  return true;
}
