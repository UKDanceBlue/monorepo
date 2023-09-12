import { DownloadableImage, FirestoreImage } from "./commonStructs";

/** @deprecated TODO: Switch to FirestoreSponsor structure */
export interface LegacyFirestoreSponsor {
  link?: string;
  logo?: string;
  name?: string;
}
/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface RawFirestoreSponsor{
  link?: string;
  logo?: FirestoreImage;
  name?: string;
}

/** @deprecated Use types from @ukdanceblue/db-app-common instead */
export interface ParsedFirestoreSponsor {
  logo?: DownloadableImage;
  link?: string;
  name?: string;
}
