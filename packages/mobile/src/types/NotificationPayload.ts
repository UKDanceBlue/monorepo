import type { FirestoreImage } from "./commonStructs";

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface NotificationInfoPopup {
  title: string;
  message: string;
  image?: FirestoreImage;
}
