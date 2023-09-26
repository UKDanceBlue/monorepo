import type { FirestoreImage } from "./commonStructs";

/** @deprecated Use types from @ukdanceblue/common instead */
export interface NotificationInfoPopup {
  title: string;
  message: string;
  image?: FirestoreImage;
}

/** @deprecated Use types from @ukdanceblue/common instead */
export interface NotificationPayload {
  url: string;
}
