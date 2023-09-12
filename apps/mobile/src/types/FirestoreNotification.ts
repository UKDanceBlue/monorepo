/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface FirestoreNotification {
  body: string;
  sendTime: string;
  sound?: string;
  title: string;
  payload?: Record<string, unknown>;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export function isFirestoreNotification(notification?: object): notification is FirestoreNotification {
  if (notification == null) {
    return false;
  }

  const {
    body, payload, sendTime, sound, title
  } = notification as Partial<FirestoreNotification>;

  // Check that all required fields are present and of the correct type
  if (body == null) {
    return false;
  } else if (typeof body !== "string") {
    return false;
  }

  if (sendTime == null) {
    return false;
  } else if (!(typeof sendTime === "string")) {
    return false;
  }

  if (sound != null && typeof sound !== "string") {
    return false;
  }

  if (title == null) {
    return false;
  } else if (typeof title !== "string") {
    return false;
  }

  return !(payload != null && typeof payload !== "object");
}
